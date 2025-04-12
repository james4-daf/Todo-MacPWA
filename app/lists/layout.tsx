import {AppSidebar} from "@/app/components/AppSideBar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Toaster} from "sonner";

export default function AppLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SidebarProvider>

                <AppSidebar/>
                <SidebarTrigger/>
                {children}
            </SidebarProvider>
            <Toaster/>
        </>


    );
}
