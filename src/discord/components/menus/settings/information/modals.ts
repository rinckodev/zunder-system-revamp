import { Modal } from "#base";
import { isNumeric } from "#functions";
import { menus } from "#menus";
import { parseIntOr } from "@magicyan/discord";

new Modal({
    customId: "menu/settings/information/:action/:index",
    cache: "cached", isFromMessage: true,
    async run(interaction, { action, index }) {
        const { client } = interaction;
        const guildData = client.mainGuildData;

        const data = interaction.fields.fields.filter(f => Boolean(f.value)).reduce(
            (prev, curr) => ({...prev, [curr.customId]:curr.value }), 
            {} as Record<string, string | number>
        );
        if (isNumeric(String(data.emoji))){
            if (!client.emojis.cache.has(String(data.emoji))) delete data.emoji;
        }
        if (data.style){
            const style = parseIntOr(String(data.style), 1);
            data.style = style > 5 ? 1 : style.toString();
        }

        await interaction.deferUpdate();

        switch(action){
            case "add":{
                guildData.information.push(data);

                index = String(guildData.information.length-1);
                break;
            }
            case "edit":{
                guildData.$set(`information.${index}`, data);
                break;
            }
        }

        await guildData.save();
        interaction.editReply(menus.settings.information.submenu(guildData, index));
    },
});