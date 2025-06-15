import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Download,
  ArrowUpDown,
} from "lucide-react";

// Mock data for user activity logs
const mockActivityLogs = [
  { id: 1, user: "Sarah Chen", action: "User created", target: "Jordan Lee", timestamp: "2025-04-15 09:23:45", ip: "192.168.1.45" },
  { id: 2, user: "Michael Thompson", action: "Role changed", target: "Taylor Smith", timestamp: "2025-04-15 10:12:33", ip: "192.168.1.22" },
  { id: 3, user: "Emma Rodriguez", action: "Password reset", target: "Alex Johnson", timestamp: "2025-04-14 16:45:12", ip: "192.168.1.87" },
  { id: 4, user: "David Kim", action: "Department assigned", target: "Casey Wilson", timestamp: "2025-04-14 14:22:56", ip: "192.168.1.33" },
  { id: 5, user: "Jordan Lee", action: "Login", target: "Self", timestamp: "2025-04-14 09:01:23", ip: "192.168.1.45" },
  { id: 6, user: "Sarah Chen", action: "System setting changed", target: "Email Configuration", timestamp: "2025-04-13 11:34:21", ip: "192.168.1.45" },
  { id: 7, user: "Michael Thompson", action: "Location created", target: "Chicago Office", timestamp: "2025-04-13 10:15:43", ip: "192.168.1.22" },
  { id: 8, user: "Emma Rodriguez", action: "User deactivated", target: "Former Employee", timestamp: "2025-04-12 15:22:11", ip: "192.168.1.87" },
  { id: 9, user: "David Kim", action: "Bulk import", target: "15 users", timestamp: "2025-04-12 14:05:32", ip: "192.168.1.33" },
  { id: 10, user: "Sarah Chen", action: "Integration configured", target: "TalentPulse API", timestamp: "2025-04-11 16:45:22", ip: "192.168.1.45" },
];

const ActivityLogs = () => {
  const { toast } = useToast();
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtered and paginated data
  const filteredLogs = mockActivityLogs.filter(log => {
    if (searchTerm && !log.action.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.target.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortField === "timestamp") {
      return sortDirection === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortField === "user") {
      return sortDirection === "asc"
        ? a.user.localeCompare(b.user)
        : b.user.localeCompare(a.user);
    }
    if (sortField === "action") {
      return sortDirection === "asc"
        ? a.action.localeCompare(b.action)
        : b.action.localeCompare(a.action);
    }
    return 0;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExportLogs = () => {
    toast({
      title: "Export Started",
      description: "Activity logs export has been initiated. You will receive an email when ready.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
        <CardDescription>
          View and analyze user activity across the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs by user, action, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportLogs}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSortChange("timestamp")}
                  >
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSortChange("user")}
                  >
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSortChange("action")}
                  >
                    Action
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Target</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {filteredLogs.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
