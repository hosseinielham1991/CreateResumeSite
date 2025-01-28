const api = {
  fetchExperiences: async ({ multiColumn = false, memberId, column }) => {
    try {
      const response = await fetch(
        `/api/members/experience/${memberId}?page=1`
      );

      let newExperiences = await response.json();
      newExperiences = newExperiences.info;

      if (!multiColumn) {
        return newExperiences;
      }

      let new_list = Array.from({ length: column }, () => []);

      newExperiences.map((item, index) => {
        new_list[index % column].push(item);
        return item;
      });

      return new_list;
    } catch (error) {
      console.error("Error fetching Experiences:", error);
    }
  },
  fetchExperiencesDetails: async ({
    multiColumn = false,
    experienceId,
    column,
  }) => {
    const response = await fetch(
      `/api/members/experience/details/${experienceId}`
    );
    let newListComponents = await response.json();
    newListComponents = newListComponents.info;

    if (!multiColumn) {
      return newListComponents;
    }

    let seperateComponents = Array.from({ length: column }, () => []);

    newListComponents.map((component, index) => {
      seperateComponents[index % column].push(component);
      return component;
    });

    return seperateComponents;
  },
};

export default api;
