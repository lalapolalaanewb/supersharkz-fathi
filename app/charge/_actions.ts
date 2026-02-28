"use server";

import getRedisClient from "@/libs/redis";
import { ChargeObjSchema, ChargeType } from "@/types/charge";
import { APIDefaultResponse } from "@/types/default";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getCharges(): Promise<APIDefaultResponse<ChargeType[]>> {
  try {
    const redis = await getRedisClient();
    if (!redis)
      return {
        success: false,
        message: "Unable to reach the database!. Please try again later.",
      };

    let data = await redis.get("charges");
    if (!data) {
      data = JSON.stringify([
        {
          charge_id: "chg_001",
          charge_amount: 120.0,
          paid_amount: 0.0,
          student_id: "stu_101",
          date_charged: "2025-01-05",
        },
        {
          charge_id: "chg_002",
          charge_amount: 80.5,
          paid_amount: 80.5,
          student_id: "stu_102",
          date_charged: "2025-01-07",
        },
        {
          charge_id: "chg_003",
          charge_amount: 150.0,
          paid_amount: 50.0,
          student_id: "stu_101",
          date_charged: "2025-01-12",
        },
        {
          charge_id: "chg_004",
          charge_amount: 95.0,
          paid_amount: 0.0,
          student_id: "stu_103",
          date_charged: "2025-01-15",
        },
        {
          charge_id: "chg_005",
          charge_amount: 200.0,
          paid_amount: 200.0,
          student_id: "stu_104",
          date_charged: "2025-01-20",
        },
      ]);
      await redis.set("charges", data);
    }

    return {
      success: true,
      data: JSON.parse(data),
      message: `[SA-GetCharges] Successfully get charges data.`,
    };
  } catch (err) {
    console.error(
      `Error SA - getCharges': Getting charges data from database.`,
      err,
    );
    return {
      success: false,
      message:
        "[SA-GetCharges] An unexpected error occurred, please try again later.",
    };
  }
}

export async function addCharge(
  body: ChargeType,
): Promise<APIDefaultResponse<undefined | null | Record<string, unknown>>> {
  const result = ChargeObjSchema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      message: "Incoming data not valid!",
      data: z.treeifyError(result.error),
    };
  }

  try {
    const redis = await getRedisClient();
    if (!redis)
      return {
        success: false,
        message: "Unable to reach the database!. Please try again later.",
      };

    const res = await getCharges();
    if (!res.success)
      return {
        success: res.success,
        message: res.message,
      };
    if (!Array.isArray(res.data))
      return {
        success: false,
        message: "Existing data invalid!",
      };

    await redis.set("charges", JSON.stringify([...res.data, body]));

    revalidatePath("/");

    return {
      success: true,
      message: `[SA-AddCharge] Successfully add new charge data.`,
      data: null,
    };
  } catch (err) {
    console.error(
      `Error SA - addCharge': Adding new charge data to database.`,
      err,
    );
    return {
      success: false,
      message:
        "[SA-AddCharge] An unexpected error occurred, please try again later.",
    };
  }
}

const EditChargeObjSchema = ChargeObjSchema.omit({ charge_id: true })
  .partial()
  .extend({ charge_id: z.string() });
type EditChargeType = z.infer<typeof EditChargeObjSchema>;
export async function editCharge(
  body: EditChargeType,
): Promise<APIDefaultResponse<undefined | null | Record<string, unknown>>> {
  const result = ChargeObjSchema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      message: "Incoming data not valid!",
      data: z.treeifyError(result.error),
    };
  }

  const { charge_id, ...others } = body;

  try {
    const redis = await getRedisClient();
    if (!redis)
      return {
        success: false,
        message: "Unable to reach the database!. Please try again later.",
      };

    const res = await getCharges();
    if (!res.success)
      return {
        success: res.success,
        message: res.message,
      };
    if (!Array.isArray(res.data))
      return {
        success: false,
        message: "Existing data invalid!",
      };

    const exists = res.data.find((item) => item.charge_id === charge_id);
    if (!exists)
      return {
        success: false,
        message: "Charge data not found!",
      };

    await redis.set(
      "charges",
      JSON.stringify(
        res.data.map((item) => {
          if (item.charge_id === charge_id)
            return {
              ...item,
              ...others,
            };

          return item;
        }),
      ),
    );

    revalidatePath("/");

    return {
      success: true,
      message: `[SA-EditCharge] Successfully edit charge data.`,
      data: null,
    };
  } catch (err) {
    console.error(
      `Error SA - editCharge': Editing charge data to database.`,
      err,
    );
    return {
      success: false,
      message:
        "[SA-EditCharge] An unexpected error occurred, please try again later.",
    };
  }
}

export async function deleteCharge(
  body: ChargeType["charge_id"],
): Promise<APIDefaultResponse<undefined | null | Record<string, unknown>>> {
  const result = ChargeObjSchema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      message: "Incoming data not valid!",
      data: z.treeifyError(result.error),
    };
  }

  const charge_id = body;

  try {
    const redis = await getRedisClient();
    if (!redis)
      return {
        success: false,
        message: "Unable to reach the database!. Please try again later.",
      };

    const res = await getCharges();
    if (!res.success)
      return {
        success: res.success,
        message: res.message,
      };
    if (!Array.isArray(res.data))
      return {
        success: false,
        message: "Existing data invalid!",
      };

    const exists = res.data.find((item) => item.charge_id === charge_id);
    if (!exists)
      return {
        success: false,
        message: "Charge data not found!",
      };

    await redis.set(
      "charges",
      JSON.stringify(res.data.filter((item) => item.charge_id !== charge_id)),
    );

    revalidatePath("/");

    return {
      success: true,
      message: `[SA-DeleteCharge] Successfully delete charge data.`,
      data: null,
    };
  } catch (err) {
    console.error(
      `Error SA - deleteCharge': Deleting charge data to database.`,
      err,
    );
    return {
      success: false,
      message:
        "[SA-DeleteCharge] An unexpected error occurred, please try again later.",
    };
  }
}
