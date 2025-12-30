import { 
  SiArduino, 
  SiRaspberrypi, 
  SiPython, 
  SiAltiumdesigner,
  SiMatlab,
  SiDassaultsystemes,
  SiKeras, 
  SiPytorch,
  SiPandas
} from "react-icons/si";
import { 
  BrainCircuit,
  Cpu,
  Globe,
  Layers,
  Box,
  Database,
  Code
} from "lucide-react";

type SkillIconProps = {
  name: string;
  className?: string;
};

export default function SkillIcon({ name, className }: SkillIconProps) {
  const skillKey = name.toLowerCase();

  if (skillKey.includes("arduino")) return <SiArduino className={className} color="#00979D" />;
  if (skillKey.includes("raspberry")) return <SiRaspberrypi className={className} color="#C51A4A" />;
  if (skillKey.includes("python")) return <SiPython className={className} color="#3776AB" />;
  if (skillKey.includes("matlab")) return <SiMatlab className={className} color="#0076A8" />;
  if (skillKey.includes("solidworks")) return <SiDassaultsystemes className={className} color="#193665" />;
  if (skillKey.includes("keras")) return <SiKeras className={className} color="#D00000" />;
  if (skillKey.includes("pytorch")) return <SiPytorch className={className} color="#EE4C2C" />;
  if (skillKey.includes("sql")) return <Database className={className} />;
  if (skillKey.includes("pandas")) return <SiPandas className={className} color="#130654" />;
  
  if (skillKey.includes("machine learning")) return <BrainCircuit className={className} />;
  if (skillKey.includes("artificial intelligence") || skillKey.includes("ai")) return <BrainCircuit className={className} />;
  if (skillKey.includes("deep learning")) return <Layers className={className} />;
  if (skillKey.includes("generative")) return <BrainCircuit className={className} />;
  if (skillKey.includes("web")) return <Globe className={className} />;
  if (skillKey.includes("pcb") || skillKey.includes("circuit")) return <SiAltiumdesigner className={className} color="#A58A54" />;
  if (skillKey.includes("embedded")) return <Cpu className={className} />;
  if (skillKey.includes("cad")) return <Box className={className} />;

  return <Code className={className} />;
}
