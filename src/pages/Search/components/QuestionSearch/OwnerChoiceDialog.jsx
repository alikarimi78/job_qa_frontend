/** Dialog asked before filing a composed job: file it as public (all organizations) or for one organization. */
import { BuildingIcon, GlobeIcon } from "@components/icons";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";

function OwnerOption({ choice, isChosen, disabled, onChoose }) {
  const Icon = choice.isPublic ? GlobeIcon : BuildingIcon;

  return (
    <label
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer
                  transition-colors duration-200 ${
                    isChosen ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  }`}
    >
      <input
        type="radio"
        name="suggestion-owner"
        value={choice.value}
        checked={isChosen}
        onChange={() => onChoose(choice.value)}
        disabled={disabled}
        className="mt-1.5 accent-blue-600"
      />
      <span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
          <span className="text-slate-500">
            <Icon className="w-3.5 h-3.5 shrink-0" />
          </span>
          {choice.title}
        </span>
        <span className="block text-xs text-slate-500 mt-0.5 leading-6">{choice.hint}</span>
      </span>
    </label>
  );
}

export default function OwnerChoiceDialog({ ownerChoice, isFiling }) {
  return (
    <Modal
      open={ownerChoice.isOpen}
      onClose={ownerChoice.close}
      size="sm"
      title="محل ثبت پیشنهاد"
      hint={`شغل «${ownerChoice.jobTitle}» در کدام بخش پایگاه داده ثبت شود؟`}
      footer={
        <>
          <Button variant="success" size="lg" onClick={ownerChoice.confirm} disabled={isFiling}>
            {isFiling ? <Spinner /> : "ثبت پیشنهاد"}
          </Button>
          <Button variant="outline" size="lg" onClick={ownerChoice.close} disabled={isFiling}>
            انصراف
          </Button>
        </>
      }
    >
      <fieldset className="flex flex-col gap-2 m-0 p-0 border-0">
        <legend className="sr-only">دامنه شغل</legend>
        {ownerChoice.choices.map((choice) => (
          <OwnerOption
            key={choice.value}
            choice={choice}
            isChosen={ownerChoice.chosenOwner === choice.value}
            disabled={isFiling}
            onChoose={ownerChoice.choose}
          />
        ))}
      </fieldset>
      <p className="text-xs text-slate-400 mt-4 leading-6">
        ثبت نهایی پس از تایید مدیر سامانه انجام می‌شود.
      </p>
    </Modal>
  );
}
