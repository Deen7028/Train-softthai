export interface IColumn {
  id: string;
  label: string;
}

export interface IManualTableProps {
  columns: IColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
}
