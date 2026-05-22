import { Building2, Home, MapPin, Trees } from "lucide-react";

export const TYPE_OPTIONS = [
  { value: "apartment", Icon: Building2 },
  { value: "house", Icon: Home },
  { value: "cottage", Icon: Trees },
  { value: "other", Icon: MapPin },
] as const;
