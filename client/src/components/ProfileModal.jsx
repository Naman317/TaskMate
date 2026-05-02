import React from "react";
import ModalWrapper from "./ModalWrapper";
import { User, Mail, Shield, Calendar } from "lucide-react";
import moment from "moment";
import Button from "./ui/Button";

const ProfileModal = ({ open, setOpen, user }) => {
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/20">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.title || "Team Member"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={18} className="text-muted-foreground" />
            <div>
              <p className="font-semibold">Email Address</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Shield size={18} className="text-muted-foreground" />
            <div>
              <p className="font-semibold">Role</p>
              <p className="text-muted-foreground capitalize">{user?.role || "User"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar size={18} className="text-muted-foreground" />
            <div>
              <p className="font-semibold">Member Since</p>
              <p className="text-muted-foreground">
                {user?.createdAt ? moment(user.createdAt).format("MMMM Do, YYYY") : "Recently Joined"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button 
            variant="outline" 
            label="Close" 
            onClick={() => setOpen(false)} 
          />
          <Button 
            variant="primary" 
            label="Edit Profile" 
            onClick={() => {}} // Placeholder for now
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProfileModal;
