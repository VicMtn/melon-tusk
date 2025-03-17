interface DataPoint {
  timestamp: string;
  value: number;
  value_classification: string;
}

interface Status {
  timestamp: string;
  error_code: number;
  error_message: string;
  elapsed: number;
  credit_count: number;
  notice: string;
}

export interface IFearAndGreed {
  data: DataPoint[];
  status: Status;
}
