import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

export function createClient() {
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(
            ([name, value]) =>
              ({
                name,
                value,
              }) as { name: string; value: string },
          );
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value);
          });
        },
      },
    },
  );
}

// import { createServerClient } from "@supabase/ssr";
// import { getCookies, setCookie } from "@tanstack/react-start/server";

// export function createClient() {
//   return createServerClient(
//     import.meta.env.VITE_SUPABASE_URL!,
//     import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return Object.entries(getCookies()).map(([name, value]) => ({
//             name,
//             value,
//           }));
//         },
//         setAll(cookies) {
//           cookies.forEach(({ name, value, options }) => {
//             setCookie(name, value, {
//               ...options,
//               path: "/",
//             });
//           });
//         },
//       },
//     },
//   );
// }
