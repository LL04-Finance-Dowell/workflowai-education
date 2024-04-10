/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import {
	setDropdowndToggle,
} from '../../../../../features/app/appSlice';
import { setDocCurrentWorkflow } from '../../../../../features/processes/processesSlice';
import Collapse from '../../../../../layouts/collapse/Collapse';
import styles from './dropdown.module.css';

const Dropdown = ({ disableClick, addWorkflowStep }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { wfToDocument, docCurrentWorkflow,  } = useSelector(
    (state) => state.processes
  );
  const {dropdownToggle } = useSelector((state) => state.app);
  /*  const [toggle, setToggle] = useState(false); */

  ////copied workflow
  const copiedWorkflow = useSelector((state) => state.copyProcess.workflow);

  useEffect(() => {
    const timerId = setTimeout(() => {
      // ('entered drop down', wfToDocument.workflows)
      if (wfToDocument.workflows && copiedWorkflow !== null) {
        dispatch(setDocCurrentWorkflow(wfToDocument.workflows[0]));

        dispatch(setDropdowndToggle(false));
        // ('finished dropdown')
      }
    }, 5000);
    return () => clearTimeout(timerId);
  }, [copiedWorkflow, wfToDocument])

  const handleToggle = () => {

    if (disableClick) return;
    dispatch(setDropdowndToggle(!dropdownToggle));
  };

  const handleCurrentWorkflow = (item) => {
    dispatch(setDocCurrentWorkflow(item));

    dispatch(setDropdowndToggle(false));
  };


  return (
    <>
      {wfToDocument.document && wfToDocument.workflows.length > 0 && (
        <div className={styles.container}>
          <button
            onClick={handleToggle}
            className={`${styles.current__item__box} ${styles.box}`}
            style={{ cursor: disableClick ? 'not-allowed' : 'initial' }}
          >
            <span>
              {docCurrentWorkflow
                ? docCurrentWorkflow?.workflows.workflow_title
                : t('Select a Workflow')}
            </span>
            <i>
              {dropdownToggle ? (
                <TiArrowSortedUp size={22} />
              ) : (
                <TiArrowSortedDown size={22} />
              )}
            </i>
          </button>

            <div style={{ marginBottom: '20px' }}>
              <Collapse open={dropdownToggle}>
                <div className={styles.options__container}>
                  {wfToDocument.workflows?.map((item) => (
                    <div
                      /* style={{
                  backgroundColor:
                    item._id === docCurrentWorkflow?.workflows._id &&
                    "var(--e-global-color-accent)",
                }} */
                      key={item._id}
                      onClick={() => handleCurrentWorkflow(item)}
                      className={`${styles.option__box} ${styles.box} ${item._id === docCurrentWorkflow?._id && styles.current
                        }`}
                    >
                      <span>{item.workflows.workflow_title}</span>
                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
