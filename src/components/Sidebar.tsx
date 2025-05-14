
import React from 'react';
import { cn } from '@/lib/utils';
import { Code, Clock, Palette, Link2, GitBranch } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("bg-[#1A1F3C] text-white flex flex-col", className)}>
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-medium">Navigation</h2>
      </div>
      
      <div className="flex-1">
        <nav className="space-y-1 p-2">
          <SidebarItem icon={<Code />} label="Code Editor" active />
          <SidebarItem icon={<Clock />} label="Version History" />
          <SidebarItem icon={<Palette />} label="Theme Selector" />
          <SidebarItem icon={<Link2 />} label="APIs & Connectors" />
          <SidebarItem icon={<GitBranch />} label="Git Integration" />
        </nav>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
