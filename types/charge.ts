import z from "zod";

export const ChargeObjSchema = z.object({
  /**
   * unique identifier for the charge
   */
  charge_id: z.string(),
  /**
   * total amount charged
   * treated as negative financial transaction
   * must be a positive number in input, but understood as debit
   */
  charge_amount: z.number(),
  /**
   * Amount that has been paid against this charge
   * must be >= 0
   * must not exceed charge_amount
   * may be 0 (unpaid), partial, or fully paid
   */
  paid_amount: z.number(),
  /**
   * identifier of the student associated with the charge
   */
  student_id: z.string(),
  /**
   * date the charge was posted - ISO 8601 format (YYYY-MM-DD)
   */
  date_charged: z.string(),
});

export type ChargeType = z.infer<typeof ChargeObjSchema>;
