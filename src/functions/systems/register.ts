import { GuildSchema, MemberSchema, db } from "#database";
import { brBuilder, findRole, sleep } from "@magicyan/discord";
import { Guild, GuildMember } from "discord.js";
import { icon } from "../utils/emojis.js";
import { sendGuildRecord } from "./guild-record.js";

function getRankRoles(guild: Guild, guildData: GuildSchema, memberData: MemberSchema){
    const { ranks } = guildData;

    const rankLevel = memberData.rank.level;
    const rankType = memberData.rank.type;
    
    const rankTypeRoleId = ranks?.types?.[rankType]?.id ?? "";
    const rankRoleId = ranks?.levels?.[rankLevel]?.id ?? "";

    const rankTypeRole = findRole(guild).byId(rankTypeRoleId);
    const rankRole = findRole(guild).byId(rankRoleId);

    return { rankTypeRole, rankRole };
}

export async function autoGiveRoles(member: GuildMember, memberData: MemberSchema){
    const guildData = member.client.mainGuildData;

    const { rankTypeRole, rankRole } = getRankRoles(member.guild, guildData, memberData);
    if (!rankTypeRole || !rankRole) return;

    member.roles.add([rankTypeRole, rankRole]);
}

export async function autoRegister(member: GuildMember){
    if (member.user.bot) return;
    if (member.isRegistered) return;
    
    const isRegistered = await db.members.hasRegister(member);
    const memberData = await db.members.get(member);

    member.isRegistered = true;

    if (!member.isRolesChecked){
        member.isRolesChecked = true;
        await autoGiveRoles(member, memberData);
        await sleep(3000);
    }

    if (!isRegistered){
        sendGuildRecord({
            guild: member.guild,
            title: "📋 Sistema de registro", color: "primary",
            thumbnail: member.displayAvatarURL(),
            details: brBuilder(
                `${icon("check")} Registrado como membro discord`,
                `- Nick: \`${member.user.username}\``
            ),
            executor: member.client, target: member,
        });
        return;
    }
}

export async function closeZunderRegister(executor: GuildMember, member: GuildMember){
    const memberData = await db.members.get(member);
    const guildData = member.client.mainGuildData;
    
    const { rankTypeRole: oldRole } = getRankRoles(member.guild, guildData, memberData);

    await memberData.$set("rank.type", "discord").save();

    const { rankTypeRole: newRole } = getRankRoles(member.guild, guildData, memberData);

    if (oldRole && newRole){
        const memberRoles = member.roles.cache.filter(r => r.id !== oldRole.id);
        const updatedRoles = memberRoles.set(newRole.id, newRole);
        member.roles.set(updatedRoles);
    }

    sendGuildRecord({
        guild: member.guild,
        title: "📋 Sistema de registro", color: "danger",
        thumbnail: member.displayAvatarURL(),
        details: brBuilder(
            `${icon("block")} Registrado Zunder encerrado`,
            `- Nick: \`${member.user.username}\``
        ),
        executor, target: member,
    });

}