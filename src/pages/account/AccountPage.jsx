// src/pages/AccountPage.jsx
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import apiFetch from "../../utils/apiFetch"; // tu helper personalizado
import { FaCamera, FaSave, FaSpinner, FaShieldAlt } from "react-icons/fa";

export default function AccountPage() {
  const { user } = useOutletContext(); // viene de Layout
  const userId = user?.id || user?.sub; // ajusta a tu claim real
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    notifications: true,
    twoFA: false,
    avatarUrl: "",
  });

  const [pwd, setPwd] = useState({
    current: "",
    newPwd: "",
    confirm: "",
  });

  const fileRef = useRef(null);

  useEffect(() => {
    if (!userId) return; // aún no tenemos el id
    const load = async () => {
      try {
        const response = await apiFetch(`/api/users/${userId}`, {
          method: "GET",
        });
        console.log(response);
        // setProfile((p) => ({
        //   ...p,
        //   name: me.name || "",
        //   email: me.email || "",
        //   phone: me.phone || "",
        //   language: me.language || "en",
        //   timezone: me.timezone || p.timezone,
        //   notifications: me.notifications ?? true,
        //   twoFA: me.twoFA ?? false,
        //   avatarUrl: me.avatarUrl || "",
        // }));
      } catch (e) {
        console.error(e);
      } finally {
        //setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/api/me", {
        method: "PUT",
        body: JSON.stringify(profile),
        headers: { "Content-Type": "application/json" },
      });
      toast("Perfil actualizado");
    } catch (e) {
      toast("No se pudo guardar el perfil");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => fileRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // preview inmediato
    const preview = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatarUrl: preview }));

    // subir
    const form = new FormData();
    form.append("avatar", file);
    try {
      const res = await apiFetch("/api/me/avatar", {
        method: "POST",
        body: form,
      });
      setProfile((p) => ({ ...p, avatarUrl: res.avatarUrl || p.avatarUrl }));
      toast("Avatar actualizado");
    } catch (e) {
      toast("No se pudo actualizar el avatar");
      console.error(e);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!pwd.newPwd || pwd.newPwd.length < 8) {
      return toast("La nueva contraseña debe tener al menos 8 caracteres");
    }
    if (pwd.newPwd !== pwd.confirm) {
      return toast("Las contraseñas no coinciden");
    }
    setSavingPwd(true);
    try {
      await apiFetch("/api/me/password", {
        method: "POST",
        body: JSON.stringify({ current: pwd.current, password: pwd.newPwd }),
        headers: { "Content-Type": "application/json" },
      });
      setPwd({ current: "", newPwd: "", confirm: "" });
      toast("Contraseña actualizada");
    } catch (e) {
      toast("No se pudo actualizar la contraseña");
      console.error(e);
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-600">
          <FaSpinner className="animate-spin" />
          <span>Cargando perfil…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">My Account</h2>
        <button
          form="form-profile"
          type="submit"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>Guardar cambios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Perfil / Avatar */}
        <section className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-medium text-gray-800 mb-4">Perfil</h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={profile.avatarUrl || "/user.png"}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <button
                onClick={handleAvatarClick}
                className="absolute -bottom-2 -right-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700"
                title="Cambiar avatar"
              >
                <FaCamera />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                {profile.name || "Usuario"}
              </p>
              <p className="text-gray-500 text-sm">{profile.email}</p>
            </div>
          </div>

          <form id="form-profile" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <input
                name="name"
                value={profile.name}
                onChange={onChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-100"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={onChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="correo@empresa.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Teléfono</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={onChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="+52 442…"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Idioma</label>
                <select
                  name="language"
                  value={profile.language}
                  onChange={onChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Zona horaria</label>
                <input
                  name="timezone"
                  value={profile.timezone}
                  onChange={onChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={profile.notifications}
                  onChange={onChange}
                  className="rounded"
                />
                <span>Recibir notificaciones por email</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="twoFA"
                  checked={profile.twoFA}
                  onChange={onChange}
                  className="rounded"
                />
                <span className="flex items-center gap-2">
                  <FaShieldAlt /> Activar verificación en dos pasos (2FA)
                </span>
              </label>
            </div>
          </form>
        </section>

        {/* Columna derecha (2): Seguridad */}
        <section className="bg-white rounded-xl border shadow-sm p-6 lg:col-span-2">
          <h3 className="font-medium text-gray-800 mb-4">Cambiar contraseña</h3>

          <form
            onSubmit={handlePassword}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Contraseña actual</label>
              <input
                type="password"
                value={pwd.current}
                onChange={(e) =>
                  setPwd((s) => ({ ...s, current: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Nueva contraseña</label>
              <input
                type="password"
                value={pwd.newPwd}
                onChange={(e) =>
                  setPwd((s) => ({ ...s, newPwd: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={pwd.confirm}
                onChange={(e) =>
                  setPwd((s) => ({ ...s, confirm: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Repite la contraseña"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-60"
                disabled={savingPwd}
              >
                {savingPwd ? <FaSpinner className="animate-spin" /> : null}
                Actualizar contraseña
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-gray-500">
            ¿Olvidaste tu contraseña?{" "}
            <a className="text-blue-600 hover:underline" href="/forgot">
              Recupérala aquí
            </a>
            .
          </div>
        </section>
      </div>
    </div>
  );
}

/** Utilidad mínima de notificación sin dependencias externas */
function toast(msg) {
  // Puedes cambiar esto por tu sistema de toasts (sonner, notistack, etc.)
  alert(msg);
}
