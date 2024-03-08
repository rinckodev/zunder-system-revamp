import { Canvas, CanvasContextGradient, CanvasContextPattern } from "@magicyan/canvas";

interface DrawBadgeOptions {
    text: string;
    radius: number;
    color: string | CanvasContextGradient | CanvasContextPattern;
    background: string | CanvasContextGradient | CanvasContextPattern;
    paddingX?: number;
    paddingY?: number;
}
export function createBadge(canvas: Canvas, options: DrawBadgeOptions){
    const { text, radius, color, background } = options;
    const { paddingX=0, paddingY=0 } = options;

    const { font } = canvas.getContext();
    const { width, height } = canvas.getContext().measureText(text);

    const badgeCanvas = new Canvas(width + paddingX, height + paddingY);
    const context = badgeCanvas.getContext();
    
    context.style.set("fill", background);
    context.beginPath();
    context.roundRect(0, 0, width + paddingX, height + paddingY, radius);
    context.fill();

    context.font.set({
        size: font.size,
        family: font.family,
        align: "start",
        baseline: "top"
    });
    context.style.set("fill", color);
    context.fillText(text, paddingX/2, paddingY/2);

    return badgeCanvas;
}