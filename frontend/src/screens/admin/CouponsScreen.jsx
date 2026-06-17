import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../assets/styles/coupons.css";

import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
} from "../../slices/couponsApiSlice";

export default function CouponsPage() {
  const { t } = useTranslation();

  const { data: coupons = [] } = useGetCouponsQuery();

  const [createCoupon] = useCreateCouponMutation();
  const [deleteCouponApi] = useDeleteCouponMutation();

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumPurchase: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const discountValue = Number(form.discountValue);
  const minimumPurchase = form.minimumPurchase
    ? Number(form.minimumPurchase)
    : 0;

  const addCoupon = async () => {
    if (!form.code.trim() || Number(form.discountValue) <= 0) return;

    try {
      await createCoupon({
        code: form.code,
        discountType: form.discountType,
        discountValue,
        minimumPurchase,
      }).unwrap();

      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minimumPurchase: "",
      });
    } catch (error) {
      console.log("Create coupon error:", error);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await deleteCouponApi(id).unwrap();
    } catch (error) {
      console.log("Delete coupon error:", error);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="lux-page-header">
        <div>
          <h2 className="lux-title">{t("coupons.title")}</h2>
          <p className="lux-subtitle">{t("coupons.subtitle")}</p>
        </div>
      </div>

      {/* FORM */}
      <div className="lux-form">
        <input
          name="code"
          placeholder={t("coupons.code")}
          value={form.code}
          onChange={handleChange}
        />

        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="percentage">{t("coupons.percentage")}</option>
          <option value="fixed">{t("coupons.fixed")}</option>
        </select>

        <input
          name="discountValue"
          placeholder={t("coupons.value")}
          value={form.discountValue}
          onChange={handleChange}
          type="number"
        />

        <input
          name="minimumPurchase"
          placeholder={t("coupons.minPurchase")}
          value={form.minimumPurchase}
          onChange={handleChange}
          type="number"
        />

        <button className="lux-add-btn" onClick={addCoupon}>
          {t("coupons.add")}
        </button>
      </div>

      {/* TABLE */}
      <table className="lux-table">
        <thead>
          <tr>
            <th>{t("coupons.table.code")}</th>
            <th>{t("coupons.table.type")}</th>
            <th>{t("coupons.table.value")}</th>
            <th>{t("coupons.table.min")}</th>
            <th>{t("coupons.table.status")}</th>
            <th>{t("coupons.table.action")}</th>
          </tr>
        </thead>

        <tbody>
          {coupons?.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.discountType}</td>
              <td>{coupon.discountValue}</td>
              <td>{coupon.minimumPurchase}</td>

              <td>
                <span
                  className={
                    coupon.isActive ? "status-active" : "status-disabled"
                  }
                >
                  {coupon.isActive ? t("coupons.active") : t("coupons.disabled")}
                </span>
              </td>

              <td>
                <button
                  className="lux-delete-btn"
                  onClick={() => deleteCoupon(coupon._id)}
                >
                  {t("coupons.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}