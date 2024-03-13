import { Command } from "#base";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
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
        }
    ],
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { member,  options } = interaction;

        switch(options.getSubcommand(true)){
            case "create":{
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
                return;
            }
        }
    }
});