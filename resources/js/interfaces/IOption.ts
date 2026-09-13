export interface IOption<T> {
  label: string;
  value: T;
  [key: string]: unknown;
}
