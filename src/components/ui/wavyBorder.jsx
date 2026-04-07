import { CORAL } from "../../styles/colors";

export default function WavyBorder({ width = 480, height = 192, padding = 12 }) {
  const totalW = width + padding * 2;
  const totalH = height + padding * 2;
  const scaleX = totalW / width;
  const scaleY = totalH / height;

  const wavePath = `M0,0 Q10,-15 20,0 Q30,15 40,0 Q50,-15 60,0 Q70,15 80,0 Q90,-15 100,0 Q110,15 120,0 Q130,-15 140,0 Q150,15 160,0 Q170,-15 180,0 Q190,15 200,0 Q210,-15 220,0 Q230,15 240,0 Q250,-15 260,0 Q270,15 280,0 Q290,-15 300,0 Q310,15 320,0 Q330,-15 340,0 Q350,15 360,0 Q370,-15 380,0 Q390,15 400,0 Q410,-15 420,0 Q430,15 440,0 Q450,-15 460,0 Q470,15 ${width},0
    Q${width + 15},10 ${width},20 Q${width - 15},30 ${width},40 Q${width + 15},50 ${width},60 Q${width - 15},70 ${width},80 Q${width + 15},90 ${width},100 Q${width - 15},110 ${width},120 Q${width + 15},130 ${width},140 Q${width - 15},150 ${width},160 Q${width + 15},170 ${width},180 Q${width - 15},${height - 15} ${width},${height}
     Q470,${height + 15} 460,${height} Q450,${height - 15} 440,${height} Q430,${height + 15} 420,${height} Q410,${height - 15} 400,${height} Q390,${height + 15} 380,${height} Q370,${height - 15} 360,${height} Q350,${height + 15} 340,${height} Q330,${height - 15} 320,${height} Q310,${height + 15} 300,${height} Q290,${height - 15} 280,${height} Q270,${height + 15} 260,${height} Q250,${height - 15} 240,${height} Q230,${height + 15} 220,${height} Q210,${height - 15} 200,${height} Q190,${height + 15} 180,${height} Q170,${height - 15} 160,${height} Q150,${height + 15} 140,${height} Q130,${height - 15} 120,${height} Q110,${height + 15} 100,${height} Q90,${height - 15} 80,${height} Q70,${height + 15} 60,${height} Q50,${height - 15} 40,${height} Q30,${height + 15} 20,${height} Q10,${height - 15} 0,${height}
    Q-15,170 0,160 Q15,150 0,140 Q-15,130 0,120 Q15,110 0,100 Q-15,90 0,80 Q15,70 0,60 Q-15,50 0,40 Q15,30 0,20 Q-15,10 0,0 Z`;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width={totalW}
      height={totalH}
      style={{
        position: "absolute",
        inset: -padding,
        zIndex: 2,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <g transform={`translate(${padding}, ${padding}) scale(${scaleX}, ${scaleY})`}>
        <path
          d={wavePath}
          fill="none"
          stroke="none"
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}