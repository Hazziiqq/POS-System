import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Settings } from "../models/settingsModel";

const settingsRepo = AppDataSource.getRepository(Settings);

// Get settings (there should be only one row)
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await settingsRepo.findOneBy({ id: 1 });

    // If no settings exist, insert default row
    if (!settings) {
      settings = await settingsRepo.save({});
    }

    res.status(200).json({ message: "Settings fetched successfully", settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { store_name, currency_code, currency_symbol, tax_rate, footer_message } = req.body;

    let settings = await settingsRepo.findOneBy({ id: 1 });
    if (!settings) {
      settings = await settingsRepo.save({});
    }

    settings.store_name = store_name ?? settings.store_name;
    settings.currency_code = currency_code ?? settings.currency_code;
    settings.currency_symbol = currency_symbol ?? settings.currency_symbol;
    settings.tax_rate = tax_rate ?? settings.tax_rate;
    settings.footer_message = footer_message ?? settings.footer_message;

    await settingsRepo.save(settings);

    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
