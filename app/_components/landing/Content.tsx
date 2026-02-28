"use client";

import { useGlobalAlert } from "@/app/_components/global/contexts/Alert";
import { GlobalDialog } from "@/app/_components/global/GlobalDialog";
import { DataTable } from "@/app/_components/global/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChargeStateType, ChargeType } from "@/types/charge";
import { ContentStatusType } from "@/types/default";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { DeleteIcon, EditIcon } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";

export type DataType = {
  add: {
    modal: boolean;
    charge: ChargeType & ChargeStateType;
  };
  delete: {
    modal: boolean;
    charge_id: string;
  };
  edit: {
    modal: boolean;
    currentCharge: ChargeType;
    charge: Partial<ChargeType> & ChargeStateType;
  };
};

const chargeDefault: ChargeType = {
  charge_amount: 0,
  charge_id: "",
  date_charged: dayjs(new Date()).format("YYYY-MM-DD"),
  paid_amount: 0,
  student_id: "",
};

const chargeStates: ChargeStateType = {
  charge_amountState: false,
  date_chargedState: false,
  paid_amountState: false,
  student_idState: false,
};

export default function Content(props: {
  charges: ChargeType[];
  status: {
    charges: ContentStatusType;
  };
}): React.JSX.Element {
  const [pending, startTransition] = useTransition();
  const { showAlert } = useGlobalAlert();

  const [dataType, setDataType] = useState<DataType>({
    add: {
      charge: {
        ...chargeDefault,
        ...chargeStates,
      },
      modal: false,
    },
    delete: {
      charge_id: "",
      modal: false,
    },
    edit: {
      currentCharge: chargeDefault,
      charge: {
        ...chargeStates,
      },
      modal: false,
    },
  });
  const [error, setError] = useState<null | string>(null);

  const handleOpenModal = (type: "add" | "delete" | "edit"): void => {
    setDataType((prev) => ({
      ...prev,
      [type]: { ...prev[type], modal: !prev[type].modal },
    }));
  };

  const columnHelper = createColumnHelper<ChargeType>();
  const columns = [
    columnHelper.accessor("charge_id", {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor((row) => row.charge_id, {
      id: "no",
      header: "No",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor((row) => row.charge_id, {
      id: "chargeId",
      header: "Charge ID",
    }),
    columnHelper.accessor((row) => row.student_id, {
      id: "studentId",
      header: "Student ID",
    }),
    columnHelper.accessor((row) => row.charge_amount.toFixed(2), {
      id: "chargeAmount",
      header: "Charge Amount",
    }),
    columnHelper.accessor((row) => row.paid_amount.toFixed(2), {
      id: "paidAmount",
      header: "Paid Amount",
    }),
    columnHelper.accessor(
      (row) => dayjs(new Date(row.date_charged)).format("YYYY-MM-DD"),
      {
        id: "dateCharged",
        header: "Paid Amount",
      },
    ),
    columnHelper.accessor(
      (row) =>
        row.charge_amount - row.paid_amount > 0
          ? (row.charge_amount - row.paid_amount).toFixed(2)
          : 0,
      {
        id: "outstandingAmount",
        header: "Outstanding Amount",
      },
    ),
    columnHelper.accessor("charge_id", {
      id: "leadActions",
      header: "Actions",
      cell: (info) => {
        return (
          <div className="flex flex-row flex-wrap gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={info.row.getIsSelected()}
              onClick={() => {
                setDataType({
                  ...dataType,
                  edit: {
                    ...dataType.edit,
                    currentCharge: info.row.original,
                    charge: {
                      ...dataType.edit.charge,
                    },
                    modal: true,
                  },
                });
              }}
            >
              <EditIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={info.row.getIsSelected()}
            >
              <DeleteIcon />
            </Button>
          </div>
        );
      },
    }),
  ];

  const columnsMobile = [
    columnHelper.accessor("charge_id", {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor((row) => row, {
      id: "all",
      header: "Charge",
      cell: (info) => {
        return (
          <>
            <div className="flex flex-row gap-2 justify-start items-center">
              <p>
                <span className="dark:text-slate-400 text-slate-500">No:</span>
              </p>
              <span>{info.row.index + 1}</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <p>
                <span className="dark:text-slate-400 text-slate-500">
                  Charge ID:
                </span>
              </p>
              <span>{info.row.original.charge_id}</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <p>
                <span className="dark:text-slate-400 text-slate-500">
                  Student ID:
                </span>
              </p>
              <span>{info.row.original.student_id}</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <p>
                <span className="dark:text-slate-400 text-slate-500">
                  Charge Amount:
                </span>
              </p>
              <span>{info.row.original.charge_amount.toFixed(2)}</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <p>
                <span className="dark:text-slate-400 text-slate-500">
                  Paid Amount:
                </span>
              </p>
              <span>{info.row.original.paid_amount.toFixed(2)}</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <p>
                <span className="dark:text-slate-400 text-slate-500">
                  Date Charged:
                </span>
              </p>
              <span>
                {dayjs(info.row.original.date_charged).format("YYYY-MM-DD")}
              </span>
              <div className="flex flex-row gap-2 justify-start items-center">
                <p>
                  <span className="dark:text-slate-400 text-slate-500">
                    Outstanding Amount:
                  </span>
                </p>
                <span>
                  {info.row.original.charge_amount -
                    info.row.original.paid_amount >
                  0
                    ? (
                        info.row.original.charge_amount -
                        info.row.original.paid_amount
                      ).toFixed(2)
                    : 0}
                </span>
              </div>
            </div>
          </>
        );
      },
      footer: (info) => "Lead",
    }),
    columnHelper.accessor("charge_id", {
      id: "leadActions",
      header: "Actions",
      cell: (info) => {
        return (
          <div className="flex flex-row flex-wrap gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={info.row.getIsSelected()}
            >
              <EditIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={info.row.getIsSelected()}
            >
              <DeleteIcon />
            </Button>
          </div>
        );
      },
    }),
  ];

  useEffect(() => {
    (() => {
      if (props.status.charges.isError)
        showAlert({
          message: props.status.charges.message,
          duration: 5000,
          title: "API Failed!",
          type: "destructive",
        });
    })();
  }, []);

  return (
    <>
      {(dataType.add.modal || dataType.edit.modal) && (
        <GlobalDialog
          open={dataType.add.modal || dataType.edit.modal}
          handleClose={() =>
            handleOpenModal(dataType.add.modal ? "add" : "edit")
          }
          handleSubmit={() => {
            startTransition(async () => {});
          }}
          width="medium"
        >
          <h2 className="text-lg font-semibold">
            {dataType.add.modal ? "Add Charge" : "Edit Charge"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Make changes and save.
          </p>

          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
              Charge ID
            </FieldLabel>
            <Input
              disabled={true}
              type="text"
              placeholder="Charge ID"
              required
              value={
                dataType.add.modal
                  ? dataType.add.charge.charge_id
                  : (dataType.edit.charge.charge_id ??
                    dataType.edit.currentCharge.charge_id)
              }
              onChange={(e) => {
                setDataType({
                  ...dataType,
                  ...(dataType.add.modal && {
                    add: {
                      ...dataType.add,
                      charge: {
                        ...dataType.add.charge,
                        charge_id: e.target.value,
                      },
                    },
                  }),
                  ...(dataType.edit.modal && {
                    edit: {
                      ...dataType.edit,
                      charge: {
                        ...dataType.edit.charge,
                        charge_id: e.target.value,
                      },
                    },
                  }),
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
              Student ID
            </FieldLabel>
            <Input
              type="text"
              placeholder="Student ID"
              required
              value={
                dataType.add.modal
                  ? dataType.add.charge.student_id
                  : (dataType.edit.charge.student_id ??
                    dataType.edit.currentCharge.student_id)
              }
              onChange={(e) => {
                setDataType({
                  ...dataType,
                  ...(dataType.add.modal && {
                    add: {
                      ...dataType.add,
                      charge: {
                        ...dataType.add.charge,
                        student_id: e.target.value,
                        student_idState:
                          !e.target.value || e.target.value === "",
                      },
                    },
                  }),
                  ...(dataType.edit.modal && {
                    edit: {
                      ...dataType.edit,
                      charge: {
                        ...dataType.edit.charge,
                        student_id: e.target.value,
                        student_idState:
                          !e.target.value || e.target.value === "",
                      },
                    },
                  }),
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
              Charge Amount
            </FieldLabel>
            <Input
              type="number"
              placeholder="Charge Amount"
              required
              value={
                dataType.add.modal
                  ? dataType.add.charge.charge_amount
                  : (dataType.edit.charge.charge_amount ??
                    dataType.edit.currentCharge.charge_amount)
              }
              onChange={(e) => {
                setDataType({
                  ...dataType,
                  ...(dataType.add.modal && {
                    add: {
                      ...dataType.add,
                      charge: {
                        ...dataType.add.charge,
                        charge_amount: +e.target.value,
                        charge_amountState:
                          !e.target.value || +e.target.value < 0,
                        ...(!(!e.target.value || +e.target.value < 0) && {
                          paid_amountState:
                            dataType.add.charge.paid_amount > +e.target.value,
                        }),
                      },
                    },
                  }),
                  ...(dataType.edit.modal && {
                    edit: {
                      ...dataType.edit,
                      charge: {
                        ...dataType.edit.charge,
                        charge_amount: +e.target.value,
                        charge_amountState:
                          !e.target.value || +e.target.value < 0,
                        ...(!(!e.target.value || +e.target.value < 0) && {
                          paid_amountState:
                            (dataType.edit.charge.paid_amount ??
                              dataType.edit.currentCharge.paid_amount) >
                            +e.target.value,
                        }),
                      },
                    },
                  }),
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
              Paid Amount
            </FieldLabel>
            <Input
              type="number"
              placeholder="Paid Amount"
              required
              value={
                dataType.add.modal
                  ? dataType.add.charge.paid_amount
                  : (dataType.edit.charge.paid_amount ??
                    dataType.edit.currentCharge.paid_amount)
              }
              onChange={(e) => {
                setDataType({
                  ...dataType,
                  ...(dataType.add.modal && {
                    add: {
                      ...dataType.add,
                      charge: {
                        ...dataType.add.charge,
                        paid_amount: +e.target.value,
                        paid_amountState:
                          !e.target.value ||
                          +e.target.value >
                            (dataType.edit.charge.charge_amount ??
                              dataType.edit.currentCharge.charge_amount),
                      },
                    },
                  }),
                  ...(dataType.edit.modal && {
                    edit: {
                      ...dataType.edit,
                      charge: {
                        ...dataType.edit.charge,
                        paid_amount: +e.target.value,
                        paid_amountState:
                          !e.target.value ||
                          +e.target.value >
                            (dataType.edit.charge.charge_amount ??
                              dataType.edit.currentCharge.charge_amount),
                      },
                    },
                  }),
                });
              }}
            />
          </Field>
        </GlobalDialog>
      )}
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <div className="hidden lg:block">
          <DataTable columns={columns} data={props.charges} />
        </div>
        <div className="lg:hidden">
          <DataTable columns={columnsMobile} data={props.charges} />
        </div>
      </div>
    </>
  );
}
