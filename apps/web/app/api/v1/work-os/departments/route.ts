import { NextResponse } from "next/server";
import { getAllDepartmentDashboards, servelectDepartmentsV62 } from "../../../../../lib/enterprise/work-os-v62-department-rbac";

export async function GET() {
  return NextResponse.json({
    version: "6.2.0",
    scope: "department-aware-rbac",
    departments: servelectDepartmentsV62,
    dashboards: getAllDepartmentDashboards()
  });
}
