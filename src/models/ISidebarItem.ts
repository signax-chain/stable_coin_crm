export interface ISidebarItem {
    title: string;
    path: string;
    icon: (index: number) => React.ReactElement;
  }