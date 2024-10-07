import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format, subYears, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatCustomDate(isoDate: string): string {
  const date = new Date(isoDate);
  const oneYearAgo = subYears(new Date(), 1);
  const weekDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const weekDay = weekDays[date.getDay()];
  const baseDate = format(date, "dd 'de' MMM", { locale: ptBR });

  let dateString = `${weekDay}, ${baseDate}`;

  if (!isAfter(date, oneYearAgo)) {
    dateString += `, ${oneYearAgo.getFullYear()}`;
  }

  return capitalizeString(dateString);
}

export function formatTime(time: string | undefined): string {
  if (time === undefined || time === '') return ''

  const timeObj = parseISO(time)

  const formattedTime = format(timeObj, 'HH:mm', { locale: ptBR })

  return formattedTime
}

export const formatCurrency = (value: number) => {
  const valueToFormat = value / 100

  return valueToFormat.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}