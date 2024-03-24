import { Command } from "#base";
import { embedChat, icon } from "#functions";
import { settings } from "#settings";
import { GithubUser, octokit } from "#tools";
import { brBuilder, createEmbed, toNull } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, time } from "discord.js";
import { StatusCodes } from "http-status-codes";

new Command({
    name: "github",
    description: "😺 Githumb command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "users",
            description: "Fetch github user information",
            type: ApplicationCommandOptionType.Subcommand,
            options:[
                {
                    name: "username",
                    description: "Github username",
                    type: ApplicationCommandOptionType.String,
                    required,
                }
            ]
        }
    ],
    async run(interaction){
        const { options } = interaction;

        const subcommand = options.getSubcommand(true);
        switch(subcommand){
            case "users":{
                const embedInfo = embedChat("primary", `${icon(":a:spinner")} Buscando dados! Aguarde...`);
                await interaction.reply({ ephemeral, embeds: [embedInfo] });

                const username = options.getString("username", true);

                const response = await octokit.request(`GET /users/${username}`).catch(toNull);

                if (!response || response.status === StatusCodes.NOT_FOUND){
                    const embed = embedChat("danger", `${icon("cancel")} Não foi encontrado um usuário do github com o nome \`${username}\`!`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }
                
                const githubUser = response.data as GithubUser;
                const info = {
                    user: `https://github.com/${githubUser.login}`,
                    repos: `https://github.com/${githubUser.login}?tab=repositories`,
                    repoCount: githubUser.public_repos > 0 ? String(githubUser.public_repos) : "vazio",
                    gistCount: githubUser.public_gists > 0 ? String(githubUser.public_gists) : "vazio",
                };
                
                const embed = createEmbed({
                    color: settings.colors.success,
                    thumbnail: githubUser.avatar_url,
                    description: brBuilder(
                        `> ${githubUser.name} | ${githubUser.login} [${icon("link")}](${info.user})`,
                        `> Bio: ${githubUser.bio??"`Não definido`"}`,
                        "",
                        `📂 Repositórios: ${info.repoCount} [${icon("link")}](${info.repos})`,
                        `📄 Gists: ${info.gistCount}`,
                        "",
                        `👤 Seguidores: ${githubUser.followers}`, 
                        `👤 Seguindo: ${githubUser.following}`,
                        "",
                        `📍 Local: ${githubUser.location??"`Não definido`"}`,
                        `📅 Criado em: ${time(new Date(githubUser.created_at), "D")}`
                    )
                });
                    
                interaction.editReply({ embeds: [embed] });
                return;
            }
        }
    }
});