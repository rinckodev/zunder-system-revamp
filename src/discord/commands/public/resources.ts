import { Command, Store } from "#base";
import { db } from "#database";
import { embedChat, icon, resolveMessageUrl } from "#functions";
import { menus } from "#menus";
import { brBuilder, createRow, extractMentionId, findChannel, toNull } from "@magicyan/discord";
import { confirm } from "@magicyan/discord-ui";
import { ApplicationCommandOptionType, ApplicationCommandType, codeBlock, time } from "discord.js";

export const resourceCommand = new Command({
    name: "resources",
    nameLocalizations: { "pt-BR": "recursos" },
    description: "Zunder resources",
    descriptionLocalizations: {"pt-BR": "Recursos da Zunder"},
    dmPermission: false,
    options: [
        {
            name: "create",
            nameLocalizations: { "pt-BR": "criar" },
            description: "Create a new resource",
            descriptionLocalizations: { "pt-BR": "Criar um novo recurso" },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "thumbnail",
                    description: "🌌 (Optional) Upload image for resource thumbnail",
                    descriptionLocalizations: {"pt-BR": "🌌 (Opcional) Enviar imagem para thumbnail do recurso"},
                    type: ApplicationCommandOptionType.Attachment,
                },
                {
                    name: "banner",
                    description: "🏞️ (Optional) Upload image for resource banner",
                    descriptionLocalizations: {"pt-BR": "🏞️ (Opcional) Enviar imagem para banner do recurso"},
                    type: ApplicationCommandOptionType.Attachment,
                },
                {
                    name: "title",
                    description: "Set resource title",
                    descriptionLocalizations: {"pt-BR": "Definir título do recurso"},
                    type: ApplicationCommandOptionType.String,
                    minLength: 16,
                },
                {
                    name: "description",
                    description: "Set resource description",
                    descriptionLocalizations: {"pt-BR": "Definir descrição do recurso"},
                    type: ApplicationCommandOptionType.String,
                    minLength: 30,
                },
                {
                    name: "url",
                    description: "Set resource url",
                    descriptionLocalizations: {"pt-BR": "Definir url do recurso"},
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: "delete",
            nameLocalizations: { "pt-BR": "deletar" },
            description: "Delete a resource",
            descriptionLocalizations: { "pt-BR": "Deletar um recurso" },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "url",
                    description: "Resource message url",
                    descriptionLocalizations: {"pt-BR": "Url da mensagem do recurso"},
                    type: ApplicationCommandOptionType.String,
                    minLength: 60,
                    required,
                }
            ]
        }
    ],
    store: {
        cooldowns: new Store<Date>({ clearTime: 40000 })
    },
    type: ApplicationCommandType.ChatInput,
    async run(interaction, { cooldowns }){
        const { member, guild, options } = interaction;
        const subcommand  = options.getSubcommand(true);

        const now = new Date();
        const cooldownKey =`${guild.id}/${member.id}/${subcommand}`;

        switch(subcommand){
            case "create":{
                const cooldown = cooldowns.get(cooldownKey) ?? now;
                if (cooldown > now){
                    const embed = embedChat("danger", `Você poderá usar este comando novamente ${time(cooldown, "R")}`);
                    interaction.reply({ ephemeral, embeds: [embed] });
                    return;
                }
                
                const title = options.getString("title");
                const description = options.getString("description");
                const url = options.getString("url");
                const banner = options.getAttachment("banner");
                const thumbnail = options.getAttachment("thumbnail");

                if (banner) banner.name = "image.png";
                if (thumbnail) thumbnail.name = "thumbnail.png";

                interaction.reply(menus.resources.create(member, {
                    title, description, url, 
                    banner: banner?.url, 
                    thumbnail: thumbnail?.url
                }));

                if (banner || thumbnail) {
                    now.setSeconds(now.getSeconds() + 40);
                } else {
                    now.setSeconds(now.getSeconds() + 20);
                }
                cooldowns.set(`${guild.id}/${member.id}/create`, now);
                return;
            }
            case "delete":{
                await interaction.deferReply({ ephemeral });

                const messageUrl = options.getString("url", true);
                
                const { channelId="", messageId="" } = resolveMessageUrl(messageUrl);
                const channel = findChannel(guild).byId(channelId);
                
                if (!channel){
                    const embed = embedChat("danger", `${icon("cancel")} O canal do recurso não foi encontrado!`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }

                const message = await channel.messages.fetch(messageId).catch(toNull);
                if (!message){
                    const embed = embedChat("danger", `${icon("cancel")} A mensagem do recurso não foi encontrada!`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }
                const { embeds: [resourceEmbed] } = message;
                if (!resourceEmbed){
                    const embed = embedChat("danger", `${icon("cancel")} A mensagem não contém um embed!`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }

                const field = resourceEmbed.data.fields?.find(f => f.name === "Autor");
                if (!field || field.value.length < 1){
                    const embed = embedChat("danger", `${icon("cancel")} A mensagem não contém um recurso!`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }
                const authorId = extractMentionId(field.value);
                if (!authorId){
                    const embed = embedChat("danger", `${icon("cancel")} A mensagem não contém um recurso!`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }
                
                const memberData = await db.members.get(member);
                if (authorId !== member.id && (memberData.rank?.level??1) < 4){
                    const embed = embedChat("danger", `${icon("cancel")} Apenas superiores podem deletar recursos de outras pessoas!`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }

                const embed = embedChat("warning", brBuilder(
                    "Você está prestes a deletar um recurso",
                    `Título **${resourceEmbed.data.title}**`,
                    `Por ${field.value}`    
                ));

                confirm({
                    components: buttons => [createRow(
                        buttons.confirm, buttons.cancel,
                    )],
                    render: components => interaction.editReply({
                        embeds: [embed], components
                    }),
                    async onClick(interaction, isCancel) {
                        await interaction.update({ components: [] });
                        if (isCancel){
                            const embed = embedChat("danger", `${icon("cancel")} Você cancelou essa ação!`);
                            interaction.editReply({ embeds: [embed] });
                            return;
                        }

                        message.delete()
                        .then(() => {
                            const embed = embedChat("success", `${icon("check")} O recurso foi deletado com sucesso!`);
                            interaction.editReply({ embeds: [embed] });
                        })
                        .catch(err => {
                            const embed = embedChat("danger", `${icon("cancel")} Não foi possível deletar o recurso! ${codeBlock(err)}`);
                            interaction.editReply({ embeds: [embed] });
                        });
                    },
                });
                return;
            }
        }
    }
});