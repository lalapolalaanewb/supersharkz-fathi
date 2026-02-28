"use client";

import { DataTable } from "@/app/_components/global/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChargeType } from "@/types/charge";
import { ContentStatusType } from "@/types/default";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { DeleteIcon, EditIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGlobalAlert } from "../global/contexts/Alert";

export default function Content(props: {
  charges: ChargeType[];
  status: {
    charges: ContentStatusType;
  };
}): React.JSX.Element {
  const [error, setError] = useState<null | string>(null);

  const { showAlert } = useGlobalAlert();

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
