/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FoldersCard from '../../components/hoverCard/foldersCard/FoldersCard';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import { useAppContext } from '../../contexts/AppContext';
import {
  SetKnowledgeFolders
} from '../../features/app/appSlice';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';

const FoldersPage = ({ knowledgeCenter }) => {
  const dispatch = useDispatch();
  const { allDocumentsStatus } = useSelector((state) => state.document);
  const { allTemplatesStatus } = useSelector((state) => state.template);

  const { folders, isFetchingFolders, fetchFolders } = useAppContext();
  const { KnowledgeFolders } = useSelector((state) => state.app);

  useEffect(() => {
    if (!folders) fetchFolders();
  }, [fetchFolders, folders]);

  let allFolders = folders ? [...folders].reverse() : [];
  // ("folders", folders)
  function fetchKnowledgeCenterData() {
    const url = `https://100094.pythonanywhere.com/v2/companies/6385c0f38eca0fb652c9457e/folders/knowledge-centre/?data_type=Real_Data`;
    axios.get(url)
      .then(response => {
        dispatch(SetKnowledgeFolders(response.data));
        // ('Data:', response.data);
        // Handle the response data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle the error
      });
  }

  useEffect(() => {
    if (knowledgeCenter) {
      fetchKnowledgeCenterData();
    }
  }, [ knowledgeCenter]);

  // ("knowledge foldersssssss", KnowledgeFolders, allFolders )

  return (
    <WorkflowLayout>
      <section id='folders_sect'>
        <ManageFiles title={'Folders'} removePageSuffix={true}>
          <div className='folders_wrapper'>
            {
              knowledgeCenter ?
                <SectionBox
                  cardBgColor='#1ABC9C'
                  title={'My Folders'}
                  Card={FoldersCard}
                  cardItems={KnowledgeFolders.templates}
                  itemType={'folders'}
                  status={
                    allDocumentsStatus === 'pending' ||
                      allTemplatesStatus === 'pending' ||
                      isFetchingFolders
                      ? 'pending'
                      : 'finished'
                  }
                  knowledgeCenter={knowledgeCenter}
                />
                :
                <SectionBox
                  cardBgColor='#1ABC9C'
                  title={'My Folders'}
                  Card={FoldersCard}
                  cardItems={allFolders}
                  status={
                    allDocumentsStatus === 'pending' ||
                      allTemplatesStatus === 'pending' ||
                      isFetchingFolders
                      ? 'pending'
                      : 'finished'
                  }
                  itemType={'folders'}
                />
            }
          </div>
        </ManageFiles>
      </section>
    </WorkflowLayout>
  );
};

export default FoldersPage;
