declare module 'lucide-react' {
  import { ComponentType } from 'react';

  interface IconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
  }

  type Icon = ComponentType<IconProps>;

  export const Menu: Icon;
  export const X: Icon;
  export const Mic: Icon;
  export const MicOff: Icon;
  export const VideoOff: Icon;
  export const PhoneOff: Icon;
  export const RefreshCw: Icon;
  export const FileCheck: Icon;
  export const User: Icon;
  export const Share2: Icon;
  export const ExternalLink: Icon;
  export const Brain: Icon;
  export const TrendingUp: Icon;
  export const ArrowRight: Icon;
  export const Mail: Icon;
  export const Phone: Icon;
  export const Video: Icon;
  export const Book: Icon;
  export const Clock: Icon;
  export const AlertTriangle: Icon;
  export const CheckCircle: Icon;
  export const Bell: Icon;
  export const Moon: Icon;
  export const Sun: Icon;
  export const Search: Icon;
  export const MessageSquare: Icon;
  export const Settings: Icon;
  export const Users: Icon;
  export const Building2: Icon;
  export const Shield: Icon;
  export const ClipboardCheck: Icon;
  export const Heart: Icon;
  export const Activity: Icon;
  export const FileText: Icon;
  export const MessageSquareMore: Icon;
  export const BarChart3: Icon;
  export const GraduationCap: Icon;
  export const HelpCircle: Icon;
  export const ShieldCheck: Icon;
  export const Home: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const MoreVertical: Icon;
  export const Pencil: Icon;
  export const UserCircle: Icon;
  export const Trash2: Icon;
  export const Stethoscope: Icon;
  export const ClipboardList: Icon;
  export const CalendarClock: Icon;
  export const PlusCircle: Icon;
  export const ChevronDown: Icon;
  export const ChevronUp: Icon;
  export const ArrowUpDown: Icon;
  export const LayoutGrid: Icon;
  export const Calendar: Icon;
  export const List: Icon;
  export const Trophy: Icon;
  export const Star: Icon;

  export type { IconProps, Icon as LucideIcon };
}
