export type ChargeType = {
  /**
   * unique identifier for the charge
   */
  charge_id: string;
  /**
   * total amount charged
   * treated as negative financial transaction
   * must be a positive number in input, but understood as debit
   */
  charge_amount: number;
  /**
   * Amount that has been paid against this charge
   * must be >= 0
   * must not exceed charge_amount
   * may be 0 (unpaid), partial, or fully paid
   */
  paid_amount: number;
  /**
   * identifier of the student associated with the charge
   */
  student_id: string;
  /**
   * date the charge was posted - ISO 8601 format (YYYY-MM-DD)
   */
  date_charged: string;
};
