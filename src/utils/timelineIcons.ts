import {
  BrickWall,
  Home,
  Layers,
  PaintBucket,
  Sparkles,
  Square,
  type LucideIcon,
} from 'lucide-react'
import type { TimelinePhaseIcon } from '../data/mockData'

export const timelinePhaseIcons: Record<TimelinePhaseIcon, LucideIcon> = {
  layers: Layers,
  square: Square,
  'brick-wall': BrickWall,
  home: Home,
  'paint-bucket': PaintBucket,
  sparkles: Sparkles,
}
