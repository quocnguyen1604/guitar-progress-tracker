import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { discordSettingsSchema } from "../../shared/validation/discordSchema";
import type { DiscordSettingsInput } from "../../shared/validation/discordSchema";
import pageStyles from "./DiscordSettingsPage.module.css";
import uiStyles from "../../shared/styles/ui.module.css";

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
  }, [setValue]);
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
    <div className={pageStyles.page}>
      <h2 className={pageStyles.title}>Discord Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={uiStyles.form}>
        <div className={uiStyles.field}>
          <label className={uiStyles.label}>Application ID:</label>
          <input className={uiStyles.input} {...register("applicationId")} />
          {formState.errors.applicationId && (
            <p className={uiStyles.errorText}>
              {formState.errors.applicationId.message}
            </p>
          )}
        </div>
        <div className={uiStyles.field}>
          <label className={uiStyles.label}>Bot Token:</label>
          <input
            className={uiStyles.input}
            type="password"
            {...register("botToken")}
          />
          {formState.errors.botToken && (
            <p className={uiStyles.errorText}>
              {formState.errors.botToken.message}
            </p>
          )}
        </div>
        <div className={uiStyles.field}>
          <label className={uiStyles.label}>Icon Update Interval (ms):</label>
          <input
            className={uiStyles.input}
            type="number"
            {...register("iconUpdateInterval", { valueAsNumber: true })}
          />
          {formState.errors.iconUpdateInterval && (
            <p className={uiStyles.errorText}>
              {formState.errors.iconUpdateInterval.message}
            </p>
          )}
        </div>
        <div className={uiStyles.actions}>
          <button className={uiStyles.button} type="submit">
            Save Settings
          </button>
          <button
            className={uiStyles.buttonSecondary}
            type="button"
            onClick={testDiscordRPC}
          >
            Test DiscordRPC
          </button>
          <button
            className={uiStyles.buttonSecondary}
            type="button"
            onClick={testDiscordRPCDisconnect}
          >
            Test DiscordRPC Disconnect
          </button>
        </div>
      </form>
    </div>
  );
}
