// Definir una interfaz simple para el diseño del email
export interface Design {
  body: {
    rows: Array<Record<string, unknown>>;
    values: Record<string, unknown>;
  };
  counters: Record<string, unknown>;
  schemaVersion: number;
}
