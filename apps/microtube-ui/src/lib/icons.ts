import {
  Moon,
  SunMedium,
  Github,
  Laptop,
  Loader2,
  LogIn,
  LogOut,
  ListVideo,
  Youtube,
  Upload,
  Film,
  User,
  Clock4,
  CalendarClock,
  Cpu,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

const Icons = {
  sun: SunMedium,
  moon: Moon,
  gitHub: Github,
  laptop: Laptop,
  loading: Loader2,
  signIn: LogIn,
  singOut: LogOut,
  myUploads: ListVideo,
  youtube: Youtube,
  upload: Upload,
  video: Film,
  user: User,
  duration: Clock4,
  ago: CalendarClock,
  yetToBeProcessed: Cpu,
  failed: AlertTriangle,
};

export default Icons;
export type Icon = LucideIcon;
