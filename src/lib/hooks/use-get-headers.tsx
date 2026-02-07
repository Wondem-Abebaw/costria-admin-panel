import { useSession } from "next-auth/react";
type HeaderType = "FormData" | "Json";
interface Props {
  type?: HeaderType;
}
export const useGetHeaders = ({ type = "Json" }: Props) => {
  const { data: session } = useSession();

  if (type === "FormData") {
    return {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${session?.user?.access_token}`,
    };
  } else {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${session?.user?.access_token}`,
    };
  }
};

// useGetHeaders
