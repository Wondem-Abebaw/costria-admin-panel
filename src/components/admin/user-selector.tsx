// components/admin/user-selector.tsx
"use client";

import { useState } from "react";
import { useCustomers } from "@/lib/hooks/use-admin-listings";
import { User } from "@/lib/types/admin";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSelectorProps {
  value?: string;
  onValueChange: (userId: string, user: User) => void;
}

export function UserSelector({ value, onValueChange }: UserSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: users, isLoading } = useCustomers();
  console.log("🚀 ~ UserSelector ~ users:", users);

  const selectedUser = users?.data?.find((u) => u.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                {selectedUser.name[0].toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-xs text-gray-500">
                  {selectedUser.email}
                </div>
              </div>
            </div>
          ) : (
            "Select user..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {users?.data?.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => {
                        onValueChange(user.id, user);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === user.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            {user.email} • {user.phone}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
