"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/components/ui/Loaders/Loader';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API, endpoints } from '../../constant/endpoints';
import Placeholder from "../../src/assets/imgs/200x100.svg"
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";
import { useAppContext } from '../../context/AppContext';
import { getProfile } from '@/actions/utils';

export default function Page() {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar);
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.termsAndConditions : en.termsAndConditions;
  }, [state.LANG]);

  useEffect(() => {
    const profile = getProfile();
    setProfileData(profile);
    if (!profile.isCorporate && !profile.hideTargetSOA) {
      router.replace("/");
    }
  }, [router]);

  if (!profileData) {
    return null;
  }

  if (!profileData.isCorporate && !profileData.hideTargetSOA) {
    return null;
  }

  return (
    <div className="container section-min-2 terms-page">
      <h2 className="main-title mt-40 mb-4">{translation.termsAndConditions}</h2>
      <div
        className="page-content"
      >
        {
          state.LANG === "AR" ? (
            <>
              {/* Intro */}
              {/* <h3 className='text-center mb-8'>للموقع الإلكتروني لشركة الإخاء العربية</h3> */}
              <p className="pb-8">يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام الموقع الإلكتروني أو إتمام أي عملية شراء. إن دخولك إلى الموقع أو استخدامك له أو إتمامك لعملية الشراء يُعد موافقة صريحة منك على الالتزام بهذه الشروط والأحكام كاملة، وفي حال عدم الموافقة، يرجى عدم استخدام الموقع.</p>

              {/* Sections */}
              <section className="mb-8">
                <h4 className='mb-2'><strong>أولاً: نطاق التطبيق</strong></h4>
                <p>تنطبق هذه الشروط والأحكام على جميع عمليات الشراء التي تتم من خلال الموقع الإلكتروني لشركة الإخاء العربية، والمخصص لموظفي الشركاء التجاريين المعتمدين فقط.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>ثانياً: قناة البيع </strong></h4>
                <p>تتم جميع طلبات الشراء حصريًا عبر المنصة الإلكترونية الخاصة بشركة الإخاء العربية، ولا يُعتد بأي طلب يتم خارج هذه المنصة.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>ثالثاً: الأسعار ونسب الخصم</strong></h4>
                <p>1.	يتم احتساب الخصم على سعر البيع للمستهلك وفقًا للعلامة التجارية لكل صنف، وذلك على النحو التالي:</p>
                <div className="product-details p0">
                  <div className="specifications-table text-center lg:w-1/2 mb-6">
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>العلامة التجارية</strong></div>
                      <div className="info w-1/2">نسبة الخصم</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>Dolu</strong></div>
                      <div className="info w-1/2">0%</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>Kids Supplies & Ride On</strong></div>
                      <div className="info w-1/2">0%</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>Speedstar</strong></div>
                      <div className="info w-1/2">0%</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>Razor</strong></div>
                      <div className="info w-1/2">15%</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>Little Tikes</strong></div>
                      <div className="info w-1/2">15%</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>LEGO</strong></div>
                      <div className="info w-1/2">15%</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>باقي العلامات التجارية</strong></div>
                      <div className="info w-1/2">25%</div>
                    </div>
                    <div className="item flex w-full">
                      <div className="title w-1/2"><strong>عروض التصفية</strong></div>
                      <div className="info w-1/2">50%</div>
                    </div>
                  </div>
                </div>
                <p>2.	يظهر السعر قبل الخصم وبعد الخصم بوضوح لكل منتج.</p>
                <p>3.	الأسعار المعروضة شاملة ضريبة المبيعات (إن وجدت)، ما لم يُنص على خلاف ذلك.</p>
                <p>4.	تحتفظ الشركة بحق تعديل الأسعار أو نسب الخصم في أي وقت دون إشعار مسبق، على أن يسري التعديل على الطلبات الجديدة فقط.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>رابعاً: سياسة الدفع</strong></h4>
                <p>1.	يتم الدفع إلكترونيًا فقط من خلال بوابة الدفع الإلكتروني المعتمدة والمزودة من شركة Network International.</p>
                <p>2.	لا يُعتبر الطلب مؤكدًا إلا بعد إتمام عملية الدفع بنجاح.</p>
                <p>3.	تتحمل الجهة المصدرة للبطاقة أي رفض أو فشل في عملية الدفع، ولا تتحمل الشركة أي مسؤولية </p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>خامساً: سياسة التوصيل</strong></h4>
                <p>1.	يكون التوصيل مجانيًا لكافة الطلبات التي تبلغ قيمتها الإجمالية خمسة وثلاثين دينارًا أردنيًا (35 د.أ) أو أكثر، وذلك داخل المملكة الأردنية الهاشمية، أما في حال كانت قيمة الطلب أقل من ذلك، فتُحتسب رسوم التوصيل على عاتق العميل وفقًا للتعرفة المعتمدة والمعلنة على الموقع عند إتمام عملية الشراء.</p>
                <p>2.	يبدأ تجهيز الطلب بعد تأكيد عملية الدفع.</p>
                <p>3.	يتم تسليم الطلب خلال مدة لا تتجاوز يومي عمل، علمًا بأن يومي الجمعة والسبت عطلة أسبوعية.</p>
                <p>4.	في حال وجود عطلة رسمية، يتم التوصيل بعد انتهاء العطلة.</p>
                <p>5.	لا تتحمل الشركة أي تأخير ناتج عن ظروف قاهرة أو خارجة عن إرادتها (مثل الأحوال الجوية أو الظروف الأمنية).</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>سادساً: سياسة الإرجاع والاستبدال</strong></h4>
                <p>1.	يشترط لإتمام الإرجاع إبراز الفاتورة الأصلية، ولن يتم قبول أي طلب إرجاع دونها.</p>
                <p>2.	يُقبل الإرجاع فقط في حال وجود تلف مصنعي مثبت، ولا يشمل ذلك سوء الاستخدام أو الإهمال.</p>
                <p>3.	يجب تقديم طلب الإرجاع خلال مدة أقصاها يومان من تاريخ الاستلام.</p>
                <p>4.	يتم التواصل بخصوص الإرجاع عبر رقم الهاتف المعتمد والمعلن على الموقع.</p>
                <p>5.	تخضع عملية الإرجاع لتقييم الشركة، ولها الحق في رفض الطلب إذا لم تتوفر الشروط.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>سابعاً: التركيب </strong></h4>
                <p>لا تشمل خدمات البيع خدمة التركيب، بما في ذلك – على سبيل المثال لا الحصر – (الدراجات الهوائية، سيارات الشحن، الألعاب الخارجية).</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>ثامناً: إيقاف الشراء المؤقت </strong></h4>
                <p> يتم إيقاف عمليات الشراء سنويًا خلال الفترة من 25/12 ولغاية 15/1 وذلك لأغراض الجرد السنوي، ولا يمكن إتمام أي طلبات خلال هذه الفترة.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>تاسعاً: حساب المستخدم</strong></h4>
                <p>1.	يلتزم المستخدم بتقديم معلومات صحيحة ودقيقة عند استخدام الموقع.</p>
                <p>2.	يتحمل المستخدم كامل المسؤولية عن أي نشاط يتم من خلال حسابه.</p>
                <p>3.	تحتفظ الشركة بحق إيقاف أو إلغاء أي حساب في حال إساءة الاستخدام أو مخالفة هذه الشروط.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>عاشراً: الملكية الفكرية </strong></h4>
                <p>جميع المحتويات المعروضة على الموقع، بما في ذلك النصوص والصور والعلامات التجارية، هي ملك لشركة الإخاء العربية، ولا يجوز استخدامها أو نسخها أو إعادة نشرها دون موافقة خطية مسبقة.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>الحادي عشر: حدود المسؤولية </strong></h4>
                <p>لا تتحمل الشركة أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع أو المنتجات، وذلك في حدود ما يسمح به القانون.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>الثاني عشر: تعديل الشروط والأحكام </strong></h4>
                <p>تحتفظ شركة الإخاء العربية بحق تعديل أو تحديث هذه الشروط والأحكام في أي وقت، ويُعتبر استمرار استخدام الموقع بعد التعديل موافقة ضمنية على الشروط المعدلة.</p>
              </section>
              <section className="mb-8">
                <h4 className='mb-2'><strong>الثالث عشر: القانون الواجب التطبيق </strong></h4>
                <p>تخضع هذه الشروط والأحكام وتُفسر وفقًا للقوانين المعمول بها في المملكة الأردنية الهاشمية، وتكون محاكمها المختصة هي المرجع الحصري لأي نزاع.</p>
              </section>
              <section className="mb-8">
                <p className='mb-2'><strong>إقرار وموافقة </strong> باستخدامك للموقع فإنك تقر بأنك قرأت هذه الشروط والأحكام وفهمتها وتوافق على الالتزام</p>
              </section>
            </>
          ) :
            (
              <>
                {/* Intro */}
                <p className="pb-8">
                  Please read these Terms and Conditions carefully before using the website or completing any purchase. Your access to, use of, or completion of any purchase through the website constitutes your explicit agreement to comply with these Terms and Conditions in full. If you do not agree, please refrain from using the website.
                </p>

                {/* Sections */}
                <section className="mb-8">
                  <h4 className="mb-2"><strong>First: Scope of Application</strong></h4>
                  <p>
                    These Terms and Conditions apply to all purchases made through Arabian Al-EKHA Company’s website, which is designated exclusively for employees of approved business partners.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Second: Sales Channel</strong></h4>
                  <p>
                    All purchase orders are processed exclusively through Arabian Al-EKHA Company’s official online platform. Any orders placed outside this platform shall not be recognized.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Third: Prices and Discount Rates</strong></h4>

                  <p>
                    1. Discounts are calculated based on the consumer selling price according to each brand, as follows:
                  </p>

                  <div className="product-details p0">
                    <div className="specifications-table lg:w-1/2 mb-6">
                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Brand</strong></div>
                        <div className="info w-1/2"><strong>Discount Rate</strong></div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Dolu</strong></div>
                        <div className="info w-1/2">0%</div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Kids Supplies & Ride On</strong></div>
                        <div className="info w-1/2">0%</div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Speedstar</strong></div>
                        <div className="info w-1/2">0%</div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Razor</strong></div>
                        <div className="info w-1/2">15%</div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Little Tikes</strong></div>
                        <div className="info w-1/2">15%</div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>LEGO</strong></div>
                        <div className="info w-1/2">15%</div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Other Brands</strong></div>
                        <div className="info w-1/2">25%</div>
                      </div>

                      <div className="item flex w-full">
                        <div className="title w-1/2"><strong>Clearance</strong></div>
                        <div className="info w-1/2">50%</div>
                      </div>
                    </div>
                  </div>

                  <p>2. The price before and after discount is clearly displayed for each product.</p>
                  <p>3. Prices shown include sales tax (if applicable), unless stated otherwise.</p>
                  <p>4. The company reserves the right to modify prices or discount rates at any time without prior notice. Any changes apply to new orders only.</p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Fourth: Payment Policy</strong></h4>
                  <p>1. Payments are accepted electronically only through the approved payment gateway provided by Network International.</p>
                  <p>2. An order is not considered confirmed until payment is successfully completed.</p>
                  <p>3. The card-issuing entity bears responsibility for any declined or failed transactions, and the company assumes no liability.</p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Fifth: Delivery Policy</strong></h4>
                  <p>1. Delivery is free for all orders with a total value of JOD 35 or more within the Hashemite Kingdom of Jordan. Orders below this amount are subject to delivery fees as displayed at checkout.</p>
                  <p>2. Order processing begins after payment confirmation.</p>
                  <p>3. Orders are delivered within a maximum of two business days. Friday and Saturday are considered weekends.</p>
                  <p>4. In the event of an official public holiday, delivery will resume after the holiday period.</p>
                  <p>5. The company is not responsible for delays caused by force majeure circumstances such as weather conditions or security situations.</p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Sixth: Return and Exchange Policy</strong></h4>
                  <p>1. The original invoice must be presented to process any return request. Returns without an invoice will not be accepted.</p>
                  <p>2. Returns are accepted only in cases of verified manufacturing defects and do not include misuse or negligence.</p>
                  <p>3. Return requests must be submitted within two days of receipt.</p>
                  <p>4. Communication regarding returns is conducted via the official phone number published on the website.</p>
                  <p>5. All return requests are subject to company evaluation, and the company reserves the right to reject any request that does not meet the conditions.</p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Seventh: Installation</strong></h4>
                  <p>
                    Installation services are not included in sales, including but not limited to bicycles, ride-on cars, and outdoor toys.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Eighth: Temporary Suspension of Purchases</strong></h4>
                  <p>
                    Purchases are suspended annually from December 25 to January 15 for inventory purposes. No orders can be placed during this period.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Ninth: User Account</strong></h4>
                  <p>1. Users must provide accurate and correct information when using the website.</p>
                  <p>2. Users are fully responsible for all activities conducted through their accounts.</p>
                  <p>3. The company reserves the right to suspend or cancel any account in case of misuse or violation of these Terms.</p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Tenth: Intellectual Property</strong></h4>
                  <p>
                    All content displayed on the website, including text, images, and trademarks, is the property of Arabian Al-EKHA Company and may not be used, copied, or republished without prior written consent.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Eleventh: Limitation of Liability</strong></h4>
                  <p>
                    The company shall not be liable for any direct or indirect damages resulting from the use of the website or products, to the extent permitted by law.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Twelfth: Amendments to Terms and Conditions</strong></h4>
                  <p>
                    Arabian Al-EKHA Company reserves the right to amend or update these Terms and Conditions at any time. Continued use of the website constitutes implicit acceptance of the amended terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="mb-2"><strong>Thirteenth: Governing Law</strong></h4>
                  <p>
                    These Terms and Conditions are governed by and construed in accordance with the laws of the Hashemite Kingdom of Jordan. Jordanian courts shall have exclusive jurisdiction over any disputes.
                  </p>
                </section>

                <section className="mb-8">
                  <p>
                    <strong>Acknowledgment and Acceptance:</strong> By using this website, you acknowledge that you have read and understood these terms and conditions and agree to be bound by them.
                  </p>
                </section>
              </>
            )
        }
      </div>
    </div>
  );
}
