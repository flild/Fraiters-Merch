import { z } from 'zod';

export const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
  telegramUsername: z.string().startsWith('@', { message: 'Юзернейм должен начинаться с @' }).min(2, { message: 'Укажите юзернейм Telegram' }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
  city: z.string().min(2, { message: 'Укажите город' }),
  address: z.string().min(5, { message: 'Укажите точный адрес' }),
  postalCode: z.string().min(6, { message: 'Укажите почтовый индекс' }),
  deliveryMethod: z.enum(['cdek', 'post', 'shelf']),
  paymentMethod: z.enum(['card', 'sbp']),
  comment: z.string().optional(),
});

export type OrderFormValuesZod = z.infer<typeof orderFormSchema>;
