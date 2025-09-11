export type ToFormDataOptions = {
  indices?: boolean;
  nullsAsEmptyStrings?: boolean;
  booleansAsStrings?: boolean;
  dateToISOString?: boolean;
  repeatKeysFor?: string[]; // <-- NUEVO: arrays que deben repetirse con la MISMA key
};

export function toFormData(
  obj: any,
  form?: FormData,
  namespace?: string,
  opt: ToFormDataOptions = {}
): FormData {
  const fd = form ?? new FormData();
  if (obj === undefined) return fd;

  const {
    indices = false,
    nullsAsEmptyStrings = false,
    booleansAsStrings = true,
    dateToISOString = true,
    repeatKeysFor = []
  } = opt;

  const isPlainObject = (v: any) => Object.prototype.toString.call(v) === '[object Object]';

  const append = (key: string, value: any) => {
    if (value === undefined) return;

    if (value === null) {
      if (nullsAsEmptyStrings) fd.append(key, '');
      return;
    }

    if (value instanceof Blob) { fd.append(key, value); return; }
    if (value instanceof Date) { fd.append(key, dateToISOString ? value.toISOString() : String(+value)); return; }

    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      Array.from(value).forEach((file, i) => {
        const k = repeatKeysFor.includes(key) ? key : (indices ? `${key}[${i}]` : `${key}[]`);
        fd.append(k, file);
      });
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((el, i) => {
        const k = repeatKeysFor.includes(key) ? key : (indices ? `${key}[${i}]` : `${key}[]`);
        if (el instanceof Blob) fd.append(k, el);
        else if (isPlainObject(el) || Array.isArray(el)) toFormData(el, fd, k, opt);
        else if (el instanceof Date) fd.append(k, dateToISOString ? el.toISOString() : String(+el));
        else if (typeof el === 'boolean' && booleansAsStrings) fd.append(k, el ? 'true' : 'false');
        else if (el != null) fd.append(k, String(el));
        else if (nullsAsEmptyStrings) fd.append(k, '');
      });
      return;
    }

    if (isPlainObject(value)) {
      Object.keys(value).forEach(prop => {
        const k = namespace ? `${namespace}[${prop}]` : prop;
        toFormData(value[prop], fd, k, opt);
      });
      return;
    }

    if (typeof value === 'boolean' && booleansAsStrings) fd.append(key, value ? 'true' : 'false');
    else fd.append(key, String(value));
  };

  if (!namespace && isPlainObject(obj)) {
    Object.keys(obj).forEach(prop => append(prop, obj[prop]));
  } else {
    append(namespace!, obj);
  }

  return fd;
}
