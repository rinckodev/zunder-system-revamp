import { MemberSchema, db } from "#database";
import { GuildMember } from "discord.js";
import { sendGuildRecord } from "./guild-record.js";
import { brBuilder, findRole } from "@magicyan/discord";
import { icon } from "../utils/emojis.js";

export async function autoGiveRoles(member: GuildMember, memberData: MemberSchema){
    const { ranks } = await db.guilds.get(member.guild.id);

    const rankLevel = (memberData?.rank?.level ?? 1) as 1 | 2 | 3 | 4 | 5;
    const rankType = memberData?.rank?.type ?? "discord";

    const rankTypeRoleId = ranks?.types?.[rankType]?.id ?? "";
    const rankRoleId = ranks?.levels?.[rankLevel]?.id ?? "";

    if (member.roles.cache.has(rankTypeRoleId) && member.roles.cache.has(rankRoleId)) return;

    const rankTypeRole = findRole(member.guild).byId(rankTypeRoleId);
    const rankRole = findRole(member.guild).byId(rankRoleId);

    if (!rankTypeRole || !rankRole) return;
    
    member.roles.add([rankTypeRole, rankRole]);
}

export async function autoRegister(member: GuildMember){
    if (member.user.bot) return;
    
    const isRegistered = await db.members.hasRegister(member);
    const memberData = await db.members.get(member);

    autoGiveRoles(member, memberData);

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