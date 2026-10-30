import React from 'react';
import '../../styles/components/Table.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
}

export function Table<T>({ data, columns, keyExtractor }: TableProps<T>) {
  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-header-cell">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="table-row">
              {columns.map((col) => (
                <td key={col.key} className="table-cell">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
