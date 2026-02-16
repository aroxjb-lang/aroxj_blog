"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Collapse, MenuItem } from "@mui/material";
import styles from "./styles.module.css";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import { useEffect, useRef, useState } from "react";
import clx from "classnames";
import { Categories } from "@/app/lib/schemas";

export const CategoriesArray: Categories[] = [
  Categories.POST,
  Categories.BLOG,
  Categories.BEAUTY,
  Categories.BODY_CARE,
  Categories.TRAVEL_NEWS,
  Categories.HEALTY_FOOD,
  Categories.DISEASES,
  Categories.PSYCHOLOGY,
  Categories.INTERVIEWS,
  Categories.CHILD_CARE,
  Categories.MEDICINE_OF_THE_FUTURE,
  Categories.PROGRAM,
  Categories.ANNOUNCEMENT,
  Categories.CULTURE,
  Categories.SPORT,
  Categories.RECIPE,
];

const CategoriesSelect = ({
  onChange,
  category,
}: {
  onChange?: (category: string) => void;
  category?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [categoryValue, setCategory] = useState(category ?? "");

  // NEW: refs for measuring
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // NEW: open direction
  const [openUp, setOpenUp] = useState(false);

  const handleChange = (value: Categories) => {
    setCategory(value);
    onChange?.(value);
    setOpen(false);
  };

  // NEW: decide open direction on open
  useEffect(() => {
    if (!open || !dropdownRef.current || !menuRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight || 0;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If not enough space below, and enough space above => open upward
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setOpenUp(true);
    } else {
      setOpenUp(false);
    }
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      onMouseLeave={() => setOpen(false)}
      onMouseEnter={() => setOpen(true)}
      onClick={() => setOpen((p) => !p)}
      className={styles.dropdown}
    >
      <div className={clx(styles.link)}>
        {!!categoryValue ? categoryValue : "Category"}
        <KeyboardArrowDownRounded
          className={clx(styles.chevron, {
            [styles.rotate]: open,
          })}
        />
      </div>

      <Collapse
        in={open}
        orientation="vertical"
        className={clx(styles.collapse, {
          [styles.openUp]: openUp,
        })}
      >
        {/* NEW: wrapper ref to measure height */}
        <div ref={menuRef} className={styles.menuInner}>
          {CategoriesArray.map((cat) => (
            <MenuItem  value={cat} key={cat} onClick={() => handleChange(cat)}>
              <div className={styles.language}>{cat}</div>
            </MenuItem>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default CategoriesSelect;
