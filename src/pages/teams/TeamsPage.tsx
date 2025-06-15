
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/adminPermissions";
import {
  Location,
  Department,
  mockLocations,
  mockDepartments,
  getDepartmentsByLocationId
} from "@/types/organization";
import LocationCard from "@/components/organization/LocationCard";
import DepartmentCard from "@/components/organization/DepartmentCard";
import AddLocationDialog from "@/components/organization/AddLocationDialog";

const TeamsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);

  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeTab, setActiveTab] = useState<string>("organization");
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    // For branch managers and other managers, use their assigned location from the user object
    if (user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor') {
      if (user.locationId) {
        const userLocationObj = mockLocations.find(location => location.id === user.locationId);

        if (userLocationObj) {
          setUserLocation(userLocationObj);
          setDepartments(getDepartmentsByLocationId(userLocationObj.id));
        }
      }
    }
  }, [user]);

  const handleAddLocation = (newLocation: Location) => {
    setLocations([...locations, newLocation]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Organization Structure</h1>
          <p className="text-muted-foreground mt-2">
            {adminUser
              ? "Manage your organization's locations, departments, and team members"
              : "Manage departments and team members in your location"}
          </p>
        </div>

        {adminUser && (
          <AddLocationDialog onAddLocation={handleAddLocation} />
        )}
      </div>

      {adminUser ? (
        // Admin view - show all locations and departments
        <div className="space-y-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="organization">
                <Building2 className="h-4 w-4 mr-2" />
                Organization View
              </TabsTrigger>
              <TabsTrigger value="locations">
                <MapPin className="h-4 w-4 mr-2" />
                Locations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="organization" className="space-y-4 mt-4">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  isAdmin={adminUser}
                />
              ))}

              {locations.length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No Locations Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first office location
                  </p>
                  <AddLocationDialog onAddLocation={handleAddLocation} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="locations" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <Building2 className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="text-xl font-medium">{location.name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {location.address}, {location.city}, {location.state} {location.zipCode}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>{getDepartmentsByLocationId(location.id).length} Departments</span>
                      <span>{location.hiringManagerIds.length} Hiring Managers</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        setActiveTab("organization");
                        // In a real app, this would scroll to the location
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Hiring Manager view - show only departments for their location
        <div className="space-y-4">
          {userLocation && (
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-medium">{userLocation.name}</h2>
              </div>
              <p className="text-muted-foreground mt-1">
                {userLocation.address}, {userLocation.city}, {userLocation.state} {userLocation.zipCode}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                isAdmin={false}
              />
            ))}

            {departments.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Departments Found</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first department
                </p>
                <Button>
                  Add Department
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
