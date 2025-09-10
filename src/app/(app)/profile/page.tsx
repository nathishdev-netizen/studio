import { currentUser } from "@/lib/data";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-0">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-sm rounded-xl">
            <CardHeader className="items-center text-center">
              <div className="relative">
                <Image
                  src={currentUser.profilePic.imageUrl}
                  alt={`Profile picture of ${currentUser.name}`}
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-background"
                  data-ai-hint={currentUser.profilePic.imageHint}
                />
                <Button size="icon" variant="secondary" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                    <Upload className="h-4 w-4"/>
                    <span className="sr-only">Upload picture</span>
                </Button>
              </div>
              <CardTitle className="text-2xl mt-2">{currentUser.name}</CardTitle>
              <CardDescription>{currentUser.email}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Additional profile stats can go here */}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Make changes to your profile here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={currentUser} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
