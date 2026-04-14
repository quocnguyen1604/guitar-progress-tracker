import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { discordSettingsSchema } from "../../shared/validation/discordSchema";
import type { DiscordSettingsInput } from "../../shared/validation/discordSchema";

export default function DiscordSettingPages() {
  const { register, handleSubmit, setValue, formState } =
    useForm<DiscordSettingsInput>({
      resolver: zodResolver(discordSettingsSchema),
      defaultValues: {
        applicationId: "",
        botToken: "",
        iconUpdateInterval: 60, //ms
      },
    });
  useEffect(() => {
    const fetchDiscordSettings = async () => {
      const response = await window.discordApi.loadSettings();
      if (response) {
        const { applicationId, iconUpdateInterval } = response;
        setValue("applicationId", applicationId);
        setValue("iconUpdateInterval", iconUpdateInterval);
      }
    };
    fetchDiscordSettings();
  }, []);
  const onSubmit = async (data: DiscordSettingsInput) => {
    const response = await window.discordApi.saveSettings(data);
    if (response) {
      alert("Settings saved successfully");
    } else {
      alert("Failed to save settings");
    }
  };

  const testDiscordRPC = async () => {
    const response = await window.discordApi.testDiscordRPC();
    if (response.connected) {
      alert(
        `Successfully connected to Discord with Client ID: ${response.clientId}`,
      );
    } else {
      alert(
        "Failed to connect to Discord. Please check your settings and try again.",
      );
    }
  };

  const testDiscordRPCDisconnect = async () => {
    await window.discordApi.testDiscordRPCDisconnect();
    alert("Disconnected from Discord RPC");
  };

  return (
    <div>
      <h2>Discord Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Application ID:</label>
          <input {...register("applicationId")} />
          {formState.errors.applicationId && (
            <p className="error-message">
              {formState.errors.applicationId.message}
            </p>
          )}
        </div>
        <div>
          <label>Bot Token:</label>
          <input type="password" {...register("botToken")} />
          {formState.errors.botToken && (
            <p className="error-message">{formState.errors.botToken.message}</p>
          )}
        </div>
        <div>
          <label>Icon Update Interval (ms):</label>
          <input
            type="number"
            {...register("iconUpdateInterval", { valueAsNumber: true })}
          />
          {formState.errors.iconUpdateInterval && (
            <p className="error-message">
              {formState.errors.iconUpdateInterval.message}
            </p>
          )}
        </div>
        <button type="submit">Save Settings</button>
        <button type="button" onClick={testDiscordRPC}>
          Test DiscordRPC
        </button>
        <button type="button" onClick={testDiscordRPCDisconnect}>
          Test DiscordRPC Disconnect
        </button>
      </form>
    </div>
  );
}
