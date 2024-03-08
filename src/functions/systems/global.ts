import { Canvas, filter } from "@magicyan/canvas";
import { GuildMember, PartialGuildMember } from "discord.js";
import { createBadge } from "../canvas/badge.js";

interface CreateCardOptions {
    action: "join" | "leave";
    member: GuildMember | PartialGuildMember;
    isRegistered?: boolean;
}
export async function createCard(options: CreateCardOptions){
    const { member, action, isRegistered= false } = options;

    const mainframe = new Canvas(1024, 260);
    const mainframecontext = mainframe.getContext();

    const canvas = new Canvas(1004, 240);
    const context = canvas.getContext();

    context.style.set("fill", "#141414");
    context.fillRect(0, 0, canvas.width, canvas.height, 20);

    context.save();
    const dx = 58;
    const dy = 30;
    const radius = 180/2;
    const avatar = await Canvas.loadImage(member.displayAvatarURL({ size: 512 }));
    context.beginPath();
    context.arc(dx + radius, dy + radius, radius, 0, Math.PI * 2);
    context.clip();
    context.drawImage(avatar, { dx, dy, dimensions: { width: 180, heigth: 180 } });
    context.restore();

    const icon = await Canvas.loadImage(
        rootTo(`assets/icons/${member.user.bot ? "robot" : "person"}.svg`)
    );

    context.drawImage(icon, { dx: 188, dy: 160 });
    
    context.font.set({
        size: 20,
        family: "JetBrainsMono Nerd Font"
    });

    const actionBadgeOptions = action === "join"
    ? { color: "#38FF70", background: "#1A8337", text: "Acabou de entrar", }
    : { color: "#FF7171", background: "#942929", text: "Acabou de sair", };

    const actionBadge = createBadge(canvas, {
        ...actionBadgeOptions, paddingX: 20, paddingY: 20, radius: 8, 
    });

    context.drawImage(actionBadge, { dx: 292, dy: 43 });

    if (action == "join"){
        const infoBadgeOptions = isRegistered
        ? { color: "#9DB3FF", background: "#3753B6", text: "Voltou", }
        : { color: "#C9C9C9", background: "#454545", text: "Primeira vez", };

        const infoBadge = createBadge(canvas, { 
            ...infoBadgeOptions, paddingX: 20, paddingY: 20, radius: 8,
        });

        context.drawImage(infoBadge, { dx: 525, dy: 43 });
    }

    context.font.setFamily("Montserrat");

    context.style.set("fill", "white");    
    context.font.set({ baseline: "top", size: 60, weight: "700" });

    context.fillText(member.displayName, 292, 96);
    context.font.set({ weight: "300", size: 30 });
    context.fillText(`@${member.user.username}`, 292, 152);

    context.save();
    context.roundRect(0, 0, canvas.width, canvas.height, 20);
    context.clip();
    
    context.style.set("fill", action === "join" ? "#1A8337" : "#942929");
    context.filter.set(filter.blur(100), filter.opacity(36));
    context.beginPath();
    context.ellipse(940, -140, 170, 170, 0, 0, Math.PI * 2);
    context.fill();
    context.filter.clear();
    
    context.restore();

    mainframecontext.drawImage(canvas, { dx: 10, dy: 10 });
    // mainframecontext.style.set("stroke", "#464646");
    // mainframecontext.line.setWidth(2);
    // mainframecontext.strokeRect(10, 10, canvas.width, canvas.height, 20);

    return mainframe;
}