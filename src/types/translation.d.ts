import { i18n, TFunction } from "i18next";

export type translationType =  {
  instance: i18n;
  promise: Promise<TFunction<"translation", undefined, "translation">>;
}

export type translationFunc = TFunction<"translation", undefined, "translation">