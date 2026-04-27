import React, { useEffect, useRef } from "react";
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    suppressErrorRendering: true
});
//clean mermaid
const cleanMermaidChart = (diagram) => {
    if (!diagram) return "";

    let diagramStr = diagram;
    if (typeof diagram === "object" && diagram !== null) {
        diagramStr = diagram.data || diagram.code || JSON.stringify(diagram);
    }
    if (typeof diagramStr !== "string") {
        diagramStr = String(diagramStr);
    }

    let clean = diagramStr
        .replace(/```mermaid/gi, "")
        .replace(/```/g, "")
        .replace(/\r?\n/g, "\n")
        .trim();

    if (!clean.trim().startsWith("graph") && !clean.startsWith("flowchart") && !clean.startsWith("sequence") && !clean.startsWith("pie") && !clean.startsWith("stateDiagram") && !clean.startsWith("classDiagram")) {
        clean = `graph TD\n${clean}`;
    }
    return clean;
};
const autoFixBadNodes = (diagram) => {
    let index = 0;
    return diagram.replace(/\[(.*?)\]/g, (_, label) => {
        index++;
        return `N${index}[${label}]`;
    });
};




function MermaidSetup({ diagram }) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (!diagram || !containerRef.current) return;
        const renderDiagram = async () => {
            try {
                containerRef.current.innerHTML = "";
                const uniqueId = `mermaid-${Math.random()
                    .toString(36)
                    .substring(2, 9)}`;
                //sanitize before render
                const safeChart = cleanMermaidChart(diagram);
                const { svg } = await mermaid.render(uniqueId, safeChart);
                containerRef.current.innerHTML = svg;


            } catch (error) {
                console.error("Mermaid render failed:", error);
                // Mermaid leaves stray error SVGs in the DOM body if it crashes. Clean them up!
                const strayNodes = document.querySelectorAll(`[id^="dmermaid-"], [id^="mermaid-"]`);
                strayNodes.forEach(node => node.remove());
            }
        };
        renderDiagram();


    }, [diagram])
    return (
        <div className='bg-white border rounded-lg p-4 overflow-x-auto'>
            <div ref={containerRef} />
        </div>
    )

}
export default MermaidSetup;
