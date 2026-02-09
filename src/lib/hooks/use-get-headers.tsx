import { useSession } from "next-auth/react";
type HeaderType = "FormData" | "Json";
interface Props {
  type?: HeaderType;
}
export const useGetHeaders = ({ type = "Json" }: Props) => {
  const { data } = useSession();
  const token = data?.user?.access_token;
  // console.log("🚀 ~ useGetHeaders ~ session:", session?.user?.access_token);

  if (type === "FormData") {
    return {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  } else {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
};

// useGetHeaders
