/** Error de la API con el mensaje legible que devuelve el backend. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly issues: { path: string; message: string }[] = [],
  ) {
    super(message);
  }

  static async from(response: Response): Promise<ApiError> {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
      issues?: { path: string; message: string }[];
    };
    return new ApiError(response.status, body.message ?? 'Ocurrió un error inesperado', body.issues);
  }
}
