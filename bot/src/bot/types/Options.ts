import {
  PermissionString,
  ApplicationCommandOptionData,
  CommandInteraction,
  User,
} from "discord.js";

export interface CommandOptions {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  category?: string;
  cooldown?: number;
  ownerOnly?: boolean;
  guildOnly?: boolean;
  args?: ApplicationCommandOptionData[];
  ephermal?: boolean;
  userPermissions?: PermissionString[];
  clientPermissions?: PermissionString[];
  exec: (
    msg: CommandInteraction,
    args: Array<string | User>
  ) => unknown | Promise<unknown>;
}

export type CommandType = Omit<CommandOptions, "exec">;

export interface EventOptions {
  name: string;
  once?: boolean;
}
