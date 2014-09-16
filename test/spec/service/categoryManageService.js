'use strict';
describe('test: CategoryService:', function () {

    var CategoryService, localStorageService;
    var store = {};
    beforeEach(module('letusgoApp'));
    beforeEach(inject(function ($injector) {

        CategoryService = $injector.get('CategoryService');
        localStorageService = $injector.get('localStorageService');

        spyOn(localStorageService, 'get').and.callFake(function (key) {
            return store[key];
        });
        spyOn(localStorageService, 'set').and.callFake(function (key, value) {
            return store[key] = value;
        });
    }));

    var ID, name, num;
    describe('test category:', function () {
        beforeEach(function () {
            ID = 'TF1001';
            name = '饮料类';
            num = 3;
        });
        it('category is ok', function () {
            var category = CategoryService.category(ID, name, num);
            expect(category.ID).toEqual('TF1001');
            expect(category.name).toEqual('饮料类');
            expect(category.num).toEqual(3);
        });
    });

    describe('test categoryDetailSuccess', function () {

        var categoryID, categoryName;
        beforeEach(function () {
            categoryID = undefined;
            categoryName = '饮料类';
        });
        it('categoryDetailSuccess is ok', function () {
            var result = CategoryService.categoryDetailSuccess(categoryID, categoryName);
            expect(result).toEqual(undefined);
        });
    });


    var currentCategories = [
        {ID: 'TF1001', name: '饮料类', num: 3},
        {ID: 'TF1002', name: '干果类', num: 0}
    ];
    describe('test IDHasExist:', function () {
        var currentIDExist, currentIDNoExist;
        beforeEach(function () {

            currentIDExist = 'TF1001';
            currentIDNoExist = 'TF1003';

            localStorageService.set('category', currentCategories);
        });
        it(' ID exist', function () {
            var existResult = CategoryService.IDHasExist(currentIDExist);
            expect(existResult).toBe(0);
        });
        it(' ID does not exist', function () {
            var existResult = CategoryService.IDHasExist(currentIDNoExist);
            expect(existResult).toBe(-1);
        });
    });


    describe('test nameHadExist:', function () {

        var currentNameExist, currentNameNoExist;
        beforeEach(function () {
            currentNameExist = '饮料类';
            currentNameNoExist = '家电类';

            localStorageService.set('category', currentCategories);
        });
        it('name exist', function () {
            var existResult = CategoryService.nameHadExist(currentNameExist);
            expect(existResult).toBe(0);
        });
        it('name does not exist', function () {
            var existResult = CategoryService.nameHadExist(currentNameNoExist);
            expect(existResult).toBe(-1);
        });
    });

    describe('test addNewCateogory()', function () {
        var currentID, currentName, currentCategories;

        beforeEach(function () {

            currentID = 'TF1004';
            currentName = '家电类';
            currentCategories = [
                {ID: 'TF1001', name: '饮料类', num: 3},
                {ID: 'TF1002', name: '干果类', num: 0}
            ];

            spyOn(CategoryService, 'category').and.returnValue({ID: 'TF1004', name: '家电类', num: 0});
        });
        it('category is null', function () {

            localStorageService.set('category', '');

            CategoryService.addNewCateogory(currentID, currentName);
            expect(CategoryService.category).toHaveBeenCalledWith(currentID, currentName, '0');

            var currentCategory = localStorageService.get('category');
            expect(currentCategory.length).toEqual(1);

            expect(currentCategory[0].name).toEqual('家电类');
            expect(currentCategory[0].ID).toEqual('TF1004');
            expect(currentCategory[0].num).toEqual(0);
        });
        it('category isnot null', function () {

            localStorageService.set('category', currentCategories);

            CategoryService.addNewCateogory(currentID, currentName);

            expect(CategoryService.category).toHaveBeenCalledWith(currentID, currentName, '0');

            var currentCategory = localStorageService.get('category');
            expect(currentCategory.length).toEqual(3);
        });
    });


    describe('test: saveButton()', function () {

        var currentCategories, currentID, currentName;
        beforeEach(function () {
            currentID = 'TF1004';
            currentName = '家电类';
            currentCategories = [
                {ID: 'TF1001', name: '饮料类', num: 3},
                {ID: 'TF1002', name: '干果类', num: 0}
            ];
            localStorageService.set('category', currentCategories);

        });
        it('categoryDetailSuccess is failed', function () {
            spyOn(CategoryService, 'IDHasExist');
            spyOn(CategoryService, 'nameHadExist');
            spyOn(CategoryService, 'categoryDetailSuccess').and.returnValue(false);
            spyOn(CategoryService, 'addNewCateogory');

            var result = CategoryService.saveButton(currentID, currentName);

            expect(result).toEqual(false);
        });
        it('ID exist', function () {
            spyOn(CategoryService, 'IDHasExist').and.returnValue(1);
            spyOn(CategoryService, 'nameHadExist');

            var result = CategoryService.saveButton(currentID, currentName);

            expect(CategoryService.IDHasExist).toHaveBeenCalledWith(currentID);
            expect(CategoryService.nameHadExist).toHaveBeenCalledWith(currentName);
            expect(result).toEqual(false);
        });
        it('name exist', function () {
            spyOn(CategoryService, 'nameHadExist').and.returnValue(1);
            spyOn(CategoryService, 'IDHasExist');

            var result = CategoryService.saveButton(currentID, currentName);

            expect(result).toEqual(false);
        });
        it('name and ID are not exist', function () {
            spyOn(CategoryService, 'nameHadExist').and.returnValue(-1);
            spyOn(CategoryService, 'IDHasExist').and.returnValue(-1);
            spyOn(CategoryService, 'addNewCateogory');

            var result = CategoryService.saveButton(currentID, currentName);

            expect(CategoryService.addNewCateogory).toHaveBeenCalledWith(currentID, currentName);
            expect(result).toEqual(true);
        });
    });
    
    describe('test updateCategory:', function () {
        var updateCategory, allCategories;
        beforeEach(function () {
            updateCategory = {ID: 'TF1001', name: '饮料', num: 3};
            allCategories = [
                {ID: 'TF1001', name: '饮料类', num: 3},
                {ID: 'TF1002', name: '干果类', num: 0}
            ];

            localStorageService.set('updateCategory', updateCategory);
            localStorageService.set('category', allCategories);
        });
        it('updateCategory is ok', function () {
            var index = CategoryService.updateCategory();
            expect(index).toEqual(0);
            expect(localStorageService.get).toHaveBeenCalled();
        });
    });
    

    describe('test:deleteButton', function () {
        var deleteCategory , notDeleteCategory;
        beforeEach(function () {
            deleteCategory = {ID: 'TF1002', name: '干果类', num: '0'};
            notDeleteCategory = {ID: 'TF1001', name: '饮料类', num: '3'};

            var currentCategories = [
                {ID: 'TF1001', name: '饮料类', num: 3},
                {ID: 'TF1002', name: '干果类', num: 0}
            ];
            localStorageService.set('category', currentCategories);
        });
        it('num is not 0', function () {
            CategoryService.deleteButton(notDeleteCategory);
            var category = localStorageService.get('category');
            expect(category.length).toBe(2);
        });
        it('num is 0', function () {
            CategoryService.deleteButton(deleteCategory);
            var category = localStorageService.get('category');
            expect(category.length).toBe(1);
        });
    });

});
